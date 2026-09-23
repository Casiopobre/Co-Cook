package com.enser.cocook.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/*
Cada usuario pode pertencer a un grupo ou a ningun. Esta taboa so serve para gardar o id do grupo e o nome do mesmo, xa que os usuarios
pertencentes ao grupo se averiguan mediante unha consulta.
*/

@Entity
@Table(name = "groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Group {
    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @Column(nullable = false, length = 100)
    private String name;


    @OneToMany(
            mappedBy = "group",
            cascade = {CascadeType.MERGE, CascadeType.REFRESH}
    )
    private List<User> users = new ArrayList<>();

}
