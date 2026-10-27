package com.enser.cocook.importer;

import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import tools.jackson.databind.json.JsonMapper;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.zip.GZIPInputStream;

@Slf4j
@Component
@ConditionalOnProperty(name = "app.food-import.file")
public class FoodImportRunner implements ApplicationRunner {

    private static final int BATCH_SIZE = 1000;

    private static final String INSERT = """
        INSERT INTO meals
            (barcode, name, kcal_per100g, carbs_per100g, proteins_per100g, fats_per100g, popularity, from_catalog)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        ON DUPLICATE KEY UPDATE barcode = barcode
        """;

    private final JsonMapper mapper = JsonMapper.builder().build();

    private final JdbcTemplate jdbcTemplate;
    private final ConfigurableApplicationContext context;
    private final String file;
    private final String countryTag;
    private final long limit;

    public FoodImportRunner(
            JdbcTemplate jdbcTemplate,
            ConfigurableApplicationContext context,
            @Value("${app.food-import.file}") String file,
            @Value("${app.food-import.country-tag:en:spain}") String countryTag,
            @Value("${app.food-import.limit:0}") long limit // 0 = sin límite; útil para una prueba rápida
    ) {
        this.jdbcTemplate = jdbcTemplate;
        this.context = context;
        this.file = file;
        this.countryTag = countryTag;
        this.limit = limit;
    }

    @Override
    public void run(@NonNull ApplicationArguments args) throws Exception {
        String marker = "\"" + countryTag + "\"";
        long lines = 0;
        long processed = 0;
        List<Object[]> batch = new ArrayList<>(BATCH_SIZE);

        log.info("Importando alimentos de {} (país: {})...", file, countryTag);

        try (BufferedReader reader = open(Path.of(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                lines++;
                if (lines % 200_000 == 0) {
                    log.info("{} líneas leídas, {} alimentos procesados", lines, processed + batch.size());
                }

                // Descarte rápido, sin parsear: la inmensa mayoría de líneas no son del país
                if (!line.contains(marker)) continue;

                Object[] row = parse(line);
                if (row == null) continue;

                batch.add(row);
                if (batch.size() >= BATCH_SIZE) processed += flush(batch);
                if (limit > 0 && processed + batch.size() >= limit) break;
            }
            processed += flush(batch);
        }

        log.info("Importación terminada: {} líneas leídas, {} alimentos procesados.", lines, processed);
        System.exit(SpringApplication.exit(context, () -> 0));
    }

    private int flush(List<Object[]> batch) {
        if (batch.isEmpty()) return 0;
        jdbcTemplate.batchUpdate(INSERT, batch);
        int n = batch.size();
        batch.clear();
        return n;
    }

    private BufferedReader open(Path path) throws IOException {
        InputStream in = Files.newInputStream(path);
        if (path.getFileName().toString().endsWith(".gz")) {
            in = new GZIPInputStream(in, 1 << 16);
        }
        return new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8), 1 << 16);
    }

    // ---- Conversión de cada línea ----

    @SuppressWarnings("unchecked")
    private Object[] parse(String line) {
        Map<String, Object> p;
        try {
            p = mapper.readValue(line, Map.class);
        } catch (Exception e) {
            return null; // línea corrupta: se ignora
        }

        // Ahora sí se comprueba el país de verdad (el marcador anterior podía estar en otro campo)
        if (!(p.get("countries_tags") instanceof List<?> countries) || !countries.contains(countryTag)) {
            return null;
        }
        Object type = p.get("product_type");
        if (type != null && !"food".equals(type)) return null;

        String code = text(p.get("code"));
        String name = firstNonBlank(text(p.get("product_name_es")), text(p.get("product_name")));
        if (code == null || name == null) return null;

        double[] m = macros(p);
        if (m == null || !plausible(m[0], m[1], m[2], m[3])) return null;

        // La marca va dentro del nombre: así se distinguen productos con el mismo nombre
        String brands = text(p.get("brands"));
        String brand = brands == null ? "" : brands.split(",")[0].trim();
        String fullName = brand.isEmpty() ? name : name + " (" + brand + ")";

        int popularity = p.get("unique_scans_n") instanceof Number n ? n.intValue() : 0;

        return new Object[]{
                truncate(code, 32), truncate(fullName, 150),
                round1(m[0]), round1(m[1]), round1(m[2]), round1(m[3]),
                popularity
        };
    }

    private static double[] macros(Map<String, Object> p) {
        Double kcal, carbs, proteins, fats;

        Map<String, Object> aggregated = map(map(p.get("nutrition")).get("aggregated_set"));
        Map<String, Object> nutrients = map(aggregated.get("nutrients"));

        if (!nutrients.isEmpty()) {
            if (!"100g".equals(aggregated.get("per"))) return null; // solo valores por 100 g
            kcal = nutrient(nutrients, "energy-kcal");
            if (kcal == null) {
                Double kj = nutrient(nutrients, "energy-kj"); // a veces solo viene en kJ
                if (kj != null) kcal = kj / 4.184;
            }
            carbs = nutrient(nutrients, "carbohydrates");
            proteins = nutrient(nutrients, "proteins");
            fats = nutrient(nutrients, "fat");
        } else {
            // Formato antiguo: claves planas terminadas en _100g
            Map<String, Object> n = map(p.get("nutriments"));
            kcal = number(n.get("energy-kcal_100g"));
            if (kcal == null) {
                Double kj = number(n.get("energy-kj_100g"));
                if (kj == null) kj = number(n.get("energy_100g"));
                if (kj != null) kcal = kj / 4.184;
            }
            carbs = number(n.get("carbohydrates_100g"));
            proteins = number(n.get("proteins_100g"));
            fats = number(n.get("fat_100g"));
        }

        // Es una base de datos colaborativa: muchos productos están incompletos
        if (kcal == null || carbs == null || proteins == null || fats == null) return null;
        return new double[]{kcal, carbs, proteins, fats};
    }

    private static Double nutrient(Map<String, Object> nutrients, String key) {
        Map<String, Object> entry = map(nutrients.get(key));
        Object value = entry.get("value");
        if (value == null) value = entry.get("value_computed");
        return number(value);
    }

    // En 100 g no caben más de 100 g de macros ni más de ~900 kcal: descarta errores de los colaboradores
    private static boolean plausible(double kcal, double carbs, double proteins, double fats) {
        return kcal >= 0 && kcal <= 900
                && carbs >= 0 && carbs <= 100
                && proteins >= 0 && proteins <= 100
                && fats >= 0 && fats <= 100
                && carbs + proteins + fats <= 105;
    }

    // ---- Utilidades ----

    @SuppressWarnings("unchecked")
    private static Map<String, Object> map(Object o) {
        return o instanceof Map<?, ?> m ? (Map<String, Object>) m : Map.of();
    }

    private static String text(Object o) {
        return o instanceof String s && !s.isBlank() ? s.trim() : null;
    }

    private static Double number(Object o) {
        if (o instanceof Number n) return n.doubleValue();
        if (o instanceof String s && !s.isBlank()) {
            try {
                return Double.parseDouble(s.replace(',', '.'));
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    private static String firstNonBlank(String a, String b) {
        return a != null ? a : b;
    }

    private static String truncate(String s, int max) {
        return s.length() <= max ? s : s.substring(0, max);
    }

    private static double round1(double v) {
        return Math.round(v * 10) / 10.0;
    }
}