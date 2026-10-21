package com.enser.cocook.service;

import com.enser.cocook.dto.UserDTO;
import com.enser.cocook.dto.auth.*;
import com.enser.cocook.exception.EmailAlreadyExistsException;
import com.enser.cocook.exception.InvalidCredentialsException;
import com.enser.cocook.model.Group;
import com.enser.cocook.model.User;
import com.enser.cocook.repository.GroupRepository;
import com.enser.cocook.repository.UserRepository;
import com.enser.cocook.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final PasswordEncoder passwordEncoder;
    private final InviteCodeGenerator inviteCodeGenerator;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }

        // Cada usuario nuevo empieza en su propio grupo
        Group ownGroup = new Group();
        ownGroup.setName(request.username() + "'s group");
        ownGroup.setInviteCode(inviteCodeGenerator.generateUnique());
        groupRepository.save(ownGroup);

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setImageRoute("/images/default-avatar.png");
        user.setGroup(ownGroup);

        userRepository.save(user);

        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(token, toDto(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(InvalidCredentialsException::new);

        if (user.getPasswordHash() == null
                || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(token, toDto(user));
    }

    public UserDTO getCurrentUser(User principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(InvalidCredentialsException::new);
        return toDto(user);
    }

    private UserDTO toDto(User user) {
        return UserDTO.from(user);
    }
}