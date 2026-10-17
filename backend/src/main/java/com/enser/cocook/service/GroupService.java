package com.enser.cocook.service;

import com.enser.cocook.dto.group.GroupDTO;
import com.enser.cocook.dto.UserDTO;
import com.enser.cocook.dto.group.InviteCodeResponse;
import com.enser.cocook.dto.group.JoinGroupRequest;
import com.enser.cocook.exception.*;
import com.enser.cocook.model.Group;
import com.enser.cocook.model.User;
import com.enser.cocook.repository.GroupRepository;
import com.enser.cocook.repository.UserRepository;
import org.jspecify.annotations.NullMarked;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@NullMarked // Para especificar que os atributos non poden ser nulos a menos que se especifique o contrario
public class GroupService {
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    @Autowired
    public GroupService(GroupRepository groupRepository,  UserRepository userRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getMembers(Long groupId, User principal) {
        requireMember(groupId, principal);

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException(groupId));

        return group.getUsers().stream().map(this::toUserDto).toList();
    }

    @Transactional(readOnly = true)
    public InviteCodeResponse getInviteCode(Long groupId, User principal) {
        requireMember(groupId, principal);

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException(groupId));

        return new InviteCodeResponse(group.getInviteCode());
    }

    @Transactional
    public GroupDTO join(JoinGroupRequest request, User principal) {
        String code = request.inviteCode().trim().toUpperCase();

        Group target = groupRepository.findByInviteCode(code)
                .orElseThrow(() -> new InvalidInviteCodeException());

        User user = loadUser(principal);
        Group oldGroup = user.getGroup();

        if (oldGroup.getId().equals(target.getId())) {
            throw new AlreadyInGroupException();
        }

        user.setGroup(target);
        userRepository.save(user);

        // Si el grupo que abandona se queda sin miembros, se elimina
        if (userRepository.countByGroupId(oldGroup.getId()) == 0) {
            groupRepository.delete(oldGroup);
        }

        return new GroupDTO(target.getId(), target.getName());
    }

    // El User del SecurityContext viene de otra sesión de Hibernate (la del filtro JWT),
    // así que se recarga dentro de la transacción actual
    private User loadUser(User principal) {
        return userRepository.findById(principal.getId())
                .orElseThrow(InvalidCredentialsException::new);
    }

    private void requireMember(Long groupId, User principal) {
        User user = loadUser(principal);
        if (!user.getGroup().getId().equals(groupId)) {
            throw new NotGroupMemberException();
        }
    }

    private UserDTO toUserDto(User user) {
        return UserDTO.from(user);
    }
}