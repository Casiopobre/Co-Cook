package com.enser.cocook.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Column(nullable = false)
    private Integer kcalPerServing;

    @Column(nullable = false)
    private Integer carbs;

    @Column(nullable = false)
    private Integer proteins;

    @Column(nullable = false)
    private Integer fats;
}
