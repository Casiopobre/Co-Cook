package com.enser.cocook.exception;

public class InvalidInviteCodeException extends RuntimeException {
    public InvalidInviteCodeException() {
        super("Código de invitación no válido");
    }
}