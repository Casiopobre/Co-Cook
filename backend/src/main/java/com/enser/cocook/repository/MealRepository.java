package com.enser.cocook.repository;

import com.enser.cocook.model.Meal;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long> {

    // Las palabras vacías ("") coinciden con todo, así que valen para rellenar hasta tres
    @Query("""
        SELECT m FROM Meal m
        WHERE m.fromCatalog = true
          AND LOWER(m.name) LIKE CONCAT('%', :w1, '%') ESCAPE '!'
          AND LOWER(m.name) LIKE CONCAT('%', :w2, '%') ESCAPE '!'
          AND LOWER(m.name) LIKE CONCAT('%', :w3, '%') ESCAPE '!'
        ORDER BY m.popularity DESC, m.name
        """)
    List<Meal> searchCatalog(@Param("w1") String w1,
                             @Param("w2") String w2,
                             @Param("w3") String w3,
                             Pageable pageable);
}