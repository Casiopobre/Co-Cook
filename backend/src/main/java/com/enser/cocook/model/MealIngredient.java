package com.enser.cocook.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "meal_ingredients",
        uniqueConstraints = @UniqueConstraint(columnNames = {"meal_id", "ingredient_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MealIngredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // El plato que se está componiendo (p. ej. "Pollo con arroz")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_id", nullable = false)
    private Meal meal;

    // Lo que lleva dentro (p. ej. "Arroz")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Meal ingredient;

    @Column(nullable = false)
    private Integer quantityGrams;
}