package com.enser.cocook.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/*
Cada usuario pode pertencer a un grupo ou a ningun (en realidade o usuario sempre pertence ao seu propio grupo
agás que se una a outro grupo distinto). Esta taboa so serve para gardar o id do grupo e o nome do mesmo, xa que
os usuarios pertencentes ao grupo se averiguan mediante unha consulta.
*/

@Entity
@Table(name = "groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    // Lado inverso da relacion usuarios:grupo (N:1)
    @OneToMany(
            mappedBy = "group",
            cascade = {CascadeType.MERGE, CascadeType.REFRESH}
    )
    // Esto é como facer un SELECT * FROM users WHERE group_id = ?
    private List<User> users = new ArrayList<>();

    @OneToMany(
            mappedBy = "group",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Stash> stash = new ArrayList<>();

    @OneToMany(
            mappedBy = "group",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ShoppingList> shoppingList = new ArrayList<>();

}
