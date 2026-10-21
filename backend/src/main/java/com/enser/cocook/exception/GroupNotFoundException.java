package com.enser.cocook.exception;

public class GroupNotFoundException extends RuntimeException {
    public GroupNotFoundException(Long groupId) {
        super("Group with id " + groupId + "  not found :(");
    }
}
