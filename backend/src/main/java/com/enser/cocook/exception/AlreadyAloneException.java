package com.enser.cocook.exception;

public class AlreadyAloneException extends RuntimeException {
    public AlreadyAloneException() {
        super("Ya estás solo en este grupo");
    }
}