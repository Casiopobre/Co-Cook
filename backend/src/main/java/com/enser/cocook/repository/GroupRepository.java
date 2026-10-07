package com.enser.cocook.repository;

import com.enser.cocook.dto.UserDTO;
import com.enser.cocook.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {
    // O metodo save xa esta implementado e devolve o Group creado

}
