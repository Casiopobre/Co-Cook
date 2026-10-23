package com.enser.cocook.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Meal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    // Todos los valores nutricionales son por cada 100 g
    @Column(nullable = false)
    private Double kcalPer100g;

    @Column(nullable = false)
    private Double carbsPer100g;

    @Column(nullable = false)
    private Double proteinsPer100g;

    @Column(nullable = false)
    private Double fatsPer100g;

    // null = comida global del catálogo; con valor = comida creada por ese grupo
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = true)
    private Group group;

    // Ingredientes, si es un plato compuesto (vacío si es una comida simple)
    @OneToMany(
            mappedBy = "meal",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<MealIngredient> ingredients = new ArrayList<>();
}