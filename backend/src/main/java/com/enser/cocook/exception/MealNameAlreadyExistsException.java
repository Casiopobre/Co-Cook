package com.enser.cocook.exception;

public class MealNameAlreadyExistsException extends RuntimeException {
    public MealNameAlreadyExistsException(String name) {
        super("Meal with name:  \"" + name + "\" already exists!");
    }
}