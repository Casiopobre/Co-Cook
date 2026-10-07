package com.enser.cocook.dto;

import com.enser.cocook.model.User;

public record UserDTO(
        Long id,
        String username,
        String email,
        String imageRoute,
        GroupDTO group
) {

    // Para converter no GroupService un obxecto User a un obxecto UserDTO
    public static UserDTO from(User user) {
        GroupDTO groupDTO = new GroupDTO(
                user.getGroup().getId(),
                user.getGroup().getName()
        );

        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getImageRoute(),
                groupDTO
        );
    }
}
