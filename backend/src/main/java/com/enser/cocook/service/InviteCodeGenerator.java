package com.enser.cocook.service;

import com.enser.cocook.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
@RequiredArgsConstructor
public class InviteCodeGenerator {

    // Sin 0/O ni 1/I para evitar confusiones al dictar o copiar el código
    private static final String ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int LENGTH = 6;

    private final SecureRandom random = new SecureRandom();
    private final GroupRepository groupRepository;

    public String generateUnique() {
        String code;
        do {
            code = randomCode();
        } while (groupRepository.existsByInviteCode(code));
        return code;
    }

    private String randomCode() {
        StringBuilder sb = new StringBuilder(LENGTH);
        for (int i = 0; i < LENGTH; i++) {
            sb.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
        }
        return sb.toString();
    }
}