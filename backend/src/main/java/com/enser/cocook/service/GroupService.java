package com.enser.cocook.service;

import com.enser.cocook.dto.UserDTO;
import com.enser.cocook.exceptions.GroupNotFoundException;
import com.enser.cocook.model.Group;
import com.enser.cocook.repository.GroupRepository;
import org.jspecify.annotations.NullMarked;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@NullMarked // Para especificar que os atributos non poden ser nulos a menos que se especifique o contrario
public class GroupService {
    private final GroupRepository groupRepository;

    @Autowired
    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    public List<UserDTO> getMembers(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException());
        return group.getUsers().stream().map(UserDTO::from).toList();
    }
}
