package com.enser.cocook.exception;

public class NotResourceOwnerException extends RuntimeException {
    public NotResourceOwnerException() {
        super("No puedes modificar los datos de otro usuario");
    }
}