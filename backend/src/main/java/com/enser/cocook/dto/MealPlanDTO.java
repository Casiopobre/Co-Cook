package com.enser.cocook.dto;

import com.enser.cocook.model.MealType;

import java.time.LocalDate;

public record MealPlanDTO(
        Long id,
        LocalDate date,
        MealDTO meal,
        MealType mealType
) {}
