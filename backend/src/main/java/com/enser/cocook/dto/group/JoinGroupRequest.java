package com.enser.cocook.dto.group;

import jakarta.validation.constraints.NotBlank;

public record JoinGroupRequest(
        @NotBlank(message = "El código de invitación es obligatorio")
        String inviteCode
) {}