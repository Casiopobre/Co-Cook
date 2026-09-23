package com.enser.cocook.model;

import jakarta.persistence.*;
import org.springframework.data.annotation.Id;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Esto é como un auto-increment
    private Long id;

    @Column(nullable = false, length = 100)
    String username;

    @Column(nullable = false, unique = true)
    String email;

    // Para inico de sesion sen google
    @Column(nullable = true)
    String password;

    // Para o inicio de sesion con google
    @Column(nullable = true, unique = true)
    String googleId;

    // Para os grupos aos que pertence o usuario
    @Column(nullable = true)
    String groupId;
}
