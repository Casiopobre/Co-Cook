package com.enser.cocook.dto.meal;

import com.enser.cocook.model.Meal;

public record MealDTO(
        Long id, String name,
        Double kcalPer100g, Double carbsPer100g, Double proteinsPer100g, Double fatsPer100g
) {
    public static MealDTO from(Meal meal) {
        return new MealDTO(meal.getId(), meal.getName(),
                meal.getKcalPer100g(), meal.getCarbsPer100g(),
                meal.getProteinsPer100g(), meal.getFatsPer100g());
    }
}