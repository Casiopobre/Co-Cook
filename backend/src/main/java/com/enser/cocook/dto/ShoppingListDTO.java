package com.enser.cocook.dto;

import com.enser.cocook.dto.meal.MealDTO;

public record ShoppingListDTO(
        Long id,
        MealDTO meal,
        Integer quantity
) {}
