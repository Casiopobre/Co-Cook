package com.enser.cocook.exception;

public class MealNotFoundException extends RuntimeException {
    public MealNotFoundException() {
        super("Meal Not Found :(");
    }
}
