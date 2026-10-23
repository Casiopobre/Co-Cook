package com.enser.cocook.dto.meal;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateMealRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 150) String name,

        // Por 100 g. Obligatorios solo en comidas simples
        @PositiveOrZero Double kcalPer100g,
        @PositiveOrZero Double carbsPer100g,
        @PositiveOrZero Double proteinsPer100g,
        @PositiveOrZero Double fatsPer100g,

        @Valid List<IngredientRequest> ingredients
) {}