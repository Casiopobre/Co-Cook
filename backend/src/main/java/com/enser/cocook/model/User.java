package com.enser.cocook.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Esto é como un auto-increment
    private Long id;

    @Column(nullable = false, length = 100)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    // Para inico de sesion sen google
    @Column(nullable = true)
    private String passwordHash;

    // Para o inicio de sesion con google
    @Column(nullable = true, unique = true)
    private String googleId;

    // Para o grupo ao que pertence o usuario (default: cada usuario pertence ao seu propio grupo)
    // Lado propietario
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    //! Preguntar profe: para gardar a foto de perfil metemos un blob na BD ou gardamos unha ruta á imaxe e a gardamos no servidor?

}
