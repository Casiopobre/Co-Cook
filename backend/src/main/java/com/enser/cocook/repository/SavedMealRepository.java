package com.enser.cocook.repository;

import com.enser.cocook.model.Meal;
import com.enser.cocook.model.SavedMeal;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface SavedMealRepository extends JpaRepository<SavedMeal, Long> {

    // Mis comidas, con filtro por nombre
    @Query("""
        SELECT m FROM SavedMeal s JOIN s.meal m
        WHERE s.user.id = :userId
          AND LOWER(m.name) LIKE LOWER(CONCAT('%', :q, '%'))
        ORDER BY m.name
        """)
    List<Meal> search(@Param("userId") Long userId,
                      @Param("q") String q,
                      Pageable pageable);

    // De los ids indicados, cuáles tiene el usuario en su colección
    @Query("SELECT s.meal.id FROM SavedMeal s WHERE s.user.id = :userId AND s.meal.id IN :ids")
    List<Long> findSavedMealIds(@Param("userId") Long userId,
                                @Param("ids") Collection<Long> ids);

    boolean existsByUserIdAndMealId(Long userId, Long mealId);

    boolean existsByUserIdAndMealNameIgnoreCase(Long userId, String name);

    void deleteByUserIdAndMealId(Long userId, Long mealId);
}