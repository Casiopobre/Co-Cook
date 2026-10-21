package com.enser.cocook.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "El nombre es obligatorio") @Size(min = 2, max = 100) String username,
        @NotBlank(message = "El email es obligatorio") @Email(message = "Email no válido") String email,
        @NotBlank(message = "La contraseña es obligatoria") @Size(min = 8, message = "Mínimo 8 caracteres") String password
) {}