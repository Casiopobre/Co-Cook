package com.enser.cocook.dto.auth;

import com.enser.cocook.dto.UserDTO;

public record AuthResponse(String token, UserDTO user) {}