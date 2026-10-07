package com.enser.cocook.exceptions;

public class GroupNotFoundException extends RuntimeException {
    public GroupNotFoundException() {
        super("Group not found :(");
    }
}
