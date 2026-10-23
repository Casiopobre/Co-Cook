package com.enser.cocook.repository;

import com.enser.cocook.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @EntityGraph(attributePaths = "group")
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByGroupId(Long groupId);
}
