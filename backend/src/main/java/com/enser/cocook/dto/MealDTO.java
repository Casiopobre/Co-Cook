package com.enser.cocook.dto;

public record MealDTO(
        Long id,
        Integer kcalPerServing,
        Integer carbs,
        Integer proteins,
        Integer fats
) {}
