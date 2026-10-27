package com.enser.cocook.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "saved_meals",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "meal_id"}))
@Getter
@Setter
@NoArgsConstructor
public class SavedMeal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_id", nullable = false)
    private Meal meal;

    public SavedMeal(User user, Meal meal) {
        this.user = user;
        this.meal = meal;
    }
}