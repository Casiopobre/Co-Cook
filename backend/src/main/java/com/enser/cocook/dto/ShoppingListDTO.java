package com.enser.cocook.dto;

public record ShoppingListDTO(
        Long id,
        MealDTO meal,
        Integer quantity
) {}
