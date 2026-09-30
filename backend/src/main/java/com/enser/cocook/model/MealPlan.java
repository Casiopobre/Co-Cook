package com.enser.cocook.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "meal_plans",
        uniqueConstraints = @UniqueConstraint(columnNames = {"group_id", "meal_type", "date"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MealPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_id", nullable = false)
    private Meal meal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private MealType mealType;

    @Column(nullable = false)
    private LocalDate date;
}
