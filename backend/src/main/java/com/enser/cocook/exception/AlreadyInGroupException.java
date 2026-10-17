package com.enser.cocook.exception;

public class AlreadyInGroupException extends RuntimeException {
    public AlreadyInGroupException() {
        super("Ya perteneces a este grupo");
    }
}