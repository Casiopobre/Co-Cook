package com.enser.cocook.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank @Email(message = "Email no válido") String email,
        @NotBlank(message = "La contraseña es obligatoria") String password
) {}