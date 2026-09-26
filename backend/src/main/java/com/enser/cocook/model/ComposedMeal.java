package com.enser.cocook.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "composed_meals",
        uniqueConstraints = @UniqueConstraint(columnNames = {"composed_meal_id", "meal_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ComposedMeal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "composed_meal_id", nullable = false)
    private Meal composedMeal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_id", nullable = false)
    private Meal meal;

    @Column(nullable = false)
    private Integer quantityGrams;
}
