package com.enser.cocook.dto;

public record UserDTO(
        Long id,
        String username,
        String email,
        String imageRoute,
        GroupDTO group
) {}
