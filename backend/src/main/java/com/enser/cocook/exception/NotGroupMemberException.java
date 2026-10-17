package com.enser.cocook.exception;

public class NotGroupMemberException extends RuntimeException {
    public NotGroupMemberException() {
        super("No perteneces a este grupo");
    }
}