package com.enser.cocook.dto;

public record StashDTO(
        Long id,
        MealDTO meal,
        Integer quantity
) {}
