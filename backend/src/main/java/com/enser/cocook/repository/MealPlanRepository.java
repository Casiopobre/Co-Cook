package com.enser.cocook.repository;

import com.enser.cocook.model.MealPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {

    boolean existsByGroupIdAndMealId(Long groupId, Long mealId);
}
