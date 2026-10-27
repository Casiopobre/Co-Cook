package com.enser.cocook.service;

import com.enser.cocook.dto.meal.MealDTO;
import com.enser.cocook.dto.meal.CreateMealRequest;
import com.enser.cocook.dto.meal.IngredientRequest;
import com.enser.cocook.exception.*;
import com.enser.cocook.model.Meal;
import com.enser.cocook.model.MealIngredient;
import com.enser.cocook.model.SavedMeal;
import com.enser.cocook.model.User;
import com.enser.cocook.repository.MealPlanRepository;
import com.enser.cocook.repository.MealRepository;
import com.enser.cocook.repository.SavedMealRepository;
import com.enser.cocook.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MealService {

    private final MealRepository mealRepository;
    private final SavedMealRepository savedMealRepository;
    private final MealPlanRepository mealPlanRepository;
    private final UserRepository userRepository;

    // ---- Catálogo importado de Open Food Facts ----

    public List<MealDTO> searchCatalog(String q, int limit) {
        String query = q == null ? "" : q.trim();
        if (query.length() < 3) throw new InvalidSearchException("Escribe al menos 3 caracteres");
        if (query.length() > 100) throw new InvalidSearchException("La búsqueda es demasiado larga");

        List<String> words = Arrays.stream(query.toLowerCase(Locale.ROOT).split("\\s+"))
                .filter(w -> !w.isBlank())
                .limit(3)
                .map(MealService::escapeLike)
                .toList();

        String w1 = words.get(0);
        String w2 = words.size() > 1 ? words.get(1) : "";
        String w3 = words.size() > 2 ? words.get(2) : "";

        return mealRepository
                .searchCatalog(w1, w2, w3, PageRequest.of(0, Math.clamp(limit, 1, 30)))
                .stream().map(MealDTO::from).toList();
    }

    // Que el usuario no pueda colar comodines en el LIKE
    private static String escapeLike(String s) {
        return s.replace("!", "!!").replace("%", "!%").replace("_", "!_");
    }

    // ---- Lectura ----

    public MealDTO findById(Long id, User principal) {
        Meal meal = mealRepository.findById(id).orElseThrow(MealNotFoundException::new);

        // Solo se ve el catálogo, lo que tienes guardado o lo planificado en tu grupo.
        // Si no, 404 para no revelar que existe
        boolean visible = meal.isFromCatalog()
                || savedMealRepository.existsByUserIdAndMealId(principal.getId(), id)
                || mealPlanRepository.existsByGroupIdAndMealId(principal.getGroup().getId(), id);
        if (!visible) throw new MealNotFoundException();

        return MealDTO.from(meal);
    }

    // ---- Creación ----

    @Transactional
    public MealDTO create(CreateMealRequest request, User principal) {
        Long userId = principal.getId();
        String name = request.name().trim();

        if (savedMealRepository.existsByUserIdAndMealNameIgnoreCase(userId, name)) {
            throw new MealNameAlreadyExistsException(name);
        }

        Meal meal = new Meal();
        meal.setName(name);

        boolean composite = request.ingredients() != null && !request.ingredients().isEmpty();
        if (composite) {
            fillFromIngredients(meal, request.ingredients(), userId);
        } else {
            fillFromValues(meal, request);
        }

        Meal saved = mealRepository.save(meal);
        // Lo que creas queda en tu colección automáticamente
        savedMealRepository.save(new SavedMeal(userRepository.getReferenceById(userId), saved));
        return MealDTO.from(saved);
    }

    private void fillFromValues(Meal meal, CreateMealRequest r) {
        if (r.kcalPer100g() == null || r.carbsPer100g() == null
                || r.proteinsPer100g() == null || r.fatsPer100g() == null) {
            throw new InvalidMealException("Indica los valores por 100 g, o añade ingredientes");
        }
        meal.setKcalPer100g(r.kcalPer100g());
        meal.setCarbsPer100g(r.carbsPer100g());
        meal.setProteinsPer100g(r.proteinsPer100g());
        meal.setFatsPer100g(r.fatsPer100g());
    }

    private void fillFromIngredients(Meal meal, List<IngredientRequest> items, Long userId) {
        List<Long> ids = items.stream().map(IngredientRequest::ingredientId).toList();
        if (new HashSet<>(ids).size() != ids.size()) {
            throw new InvalidMealException("Un ingrediente no puede aparecer dos veces");
        }

        // Los ingredientes deben estar en tu colección
        Set<Long> mine = new HashSet<>(savedMealRepository.findSavedMealIds(userId, ids));
        Map<Long, Meal> found = mealRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Meal::getId, Function.identity()));

        double kcal = 0, carbs = 0, proteins = 0, fats = 0;
        int totalGrams = 0;

        for (IngredientRequest item : items) {
            Meal ingredient = found.get(item.ingredientId());
            if (ingredient == null || !mine.contains(ingredient.getId())) {
                throw new InvalidMealException("Ingrediente no encontrado: " + item.ingredientId());
            }

            double factor = item.quantityGrams() / 100.0;
            kcal += ingredient.getKcalPer100g() * factor;
            carbs += ingredient.getCarbsPer100g() * factor;
            proteins += ingredient.getProteinsPer100g() * factor;
            fats += ingredient.getFatsPer100g() * factor;
            totalGrams += item.quantityGrams();

            MealIngredient row = new MealIngredient();
            row.setMeal(meal);
            row.setIngredient(ingredient);
            row.setQuantityGrams(item.quantityGrams());
            meal.getIngredients().add(row);
        }

        // Lo acumulado es el total de la receta; se guarda "por 100 g del plato", redondeando una sola vez
        double per100 = 100.0 / totalGrams;
        meal.setKcalPer100g(round1(kcal * per100));
        meal.setCarbsPer100g(round1(carbs * per100));
        meal.setProteinsPer100g(round1(proteins * per100));
        meal.setFatsPer100g(round1(fats * per100));
    }

    private static double round1(double v) {
        return Math.round(v * 10) / 10.0;
    }
}