package com.enser.cocook.repository;

import com.enser.cocook.model.Meal;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findByGroupId(Long groupId);

    @Query("""
    SELECT m FROM Meal m
    WHERE (m.group IS NULL OR m.group.id = :groupId)
      AND LOWER(m.name) LIKE LOWER(CONCAT('%', :q, '%'))
    ORDER BY m.name
    """)
    List<Meal> search(@Param("groupId") Long groupId,
                      @Param("q") String q,
                      Pageable pageable);

    boolean existsByGroupIdAndNameIgnoreCase(Long groupId, String name);
}
