package com.enser.cocook.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meals")
@Getter
@Setter
@NoArgsConstructor
public class Meal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    // Todos los valores nutricionales son por cada 100 g
    @Column(name = "kcal_per100g", nullable = false)
    private Double kcalPer100g;

    @Column(name = "carbs_per100g", nullable = false)
    private Double carbsPer100g;

    @Column(name = "proteins_per100g", nullable = false)
    private Double proteinsPer100g;

    @Column(name = "fats_per100g", nullable = false)
    private Double fatsPer100g;

    // Código de barras: solo en los productos importados (varios NULL no chocan en un índice único)
    @Column(unique = true, length = 32)
    private String barcode;

    // true = viene del catálogo importado: lo ve todo el mundo y no se puede editar ni borrar
    @Column(name = "from_catalog", nullable = false)
    private boolean fromCatalog = false;

    // Veces que se ha escaneado: para que "leche" muestre antes lo conocido
    @Column(nullable = false)
    private Integer popularity = 0;

    // Ingredientes, si es un plato compuesto
    @OneToMany(mappedBy = "meal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MealIngredient> ingredients = new ArrayList<>();

    @OneToMany(mappedBy = "meal", cascade = CascadeType.REMOVE)
    private List<SavedMeal> savedBy = new ArrayList<>();
}