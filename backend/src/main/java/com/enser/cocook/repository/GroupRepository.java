package com.enser.cocook.repository;

import com.enser.cocook.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GroupRepository extends JpaRepository<Group, Long> {
    // O metodo save xa esta implementado e devolve o Group creado

    Optional<Group> findByInviteCode(String inviteCode);
    boolean existsByInviteCode(String code);
}
