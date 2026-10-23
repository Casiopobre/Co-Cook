package com.enser.cocook.dto.meal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record IngredientRequest(
        @NotNull(message = "Falta el ingrediente") Long ingredientId,
        @NotNull @Positive(message = "La cantidad debe ser mayor que 0") Integer quantityGrams
) {}