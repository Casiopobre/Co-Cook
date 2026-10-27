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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final InviteCodeGenerator inviteCodeGenerator;

    public List<UserDTO> getMembers(Long groupId, User principal) {
        requireMember(groupId, principal);

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException(groupId));

        return group.getUsers().stream().map(UserDTO::from).toList();
    }

    public InviteCodeResponse getInviteCode(Long groupId, User principal) {
        requireMember(groupId, principal);

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException(groupId));

        return new InviteCodeResponse(group.getInviteCode());
    }

    @Transactional
    public GroupDTO join(Long userId, JoinGroupRequest request, User principal) {
        requireSelf(userId, principal);

        String code = request.inviteCode().trim().toUpperCase();
        Group target = groupRepository.findByInviteCode(code)
                .orElseThrow(InvalidInviteCodeException::new);

        // Se recarga: el principal viene del filtro JWT y no está ligado a esta sesión,
        // y aquí se modifica y se guarda
        User user = userRepository.findById(userId)
                .orElseThrow(InvalidCredentialsException::new);
        Group oldGroup = user.getGroup();

        if (oldGroup.getId().equals(target.getId())) {
            throw new AlreadyInGroupException();
        }

        user.setGroup(target);
        userRepository.save(user);

        // Si el grupo que dejas se queda vacío, se elimina con su planificador,
        // despensa y lista de la compra. Las comidas no se pierden: son de cada
        // usuario, no del grupo
        if (userRepository.countByGroupId(oldGroup.getId()) == 0) {
            groupRepository.delete(oldGroup);
        }

        return new GroupDTO(target.getId(), target.getName());
    }

    // El grupo del principal se carga con el usuario (@EntityGraph en findByEmail),
    // así que no hace falta otra consulta
    private void requireMember(Long groupId, User principal) {
        if (!principal.getGroup().getId().equals(groupId)) {
            throw new NotGroupMemberException();
        }
    }

    private void requireSelf(Long userId, User principal) {
        if (!principal.getId().equals(userId)) {
            throw new NotResourceOwnerException();
        }
    }

    @Transactional
    public GroupDTO leave(Long userId, User principal) {
        requireSelf(userId, principal);

        User user = userRepository.findById(userId)
                .orElseThrow(InvalidCredentialsException::new);
        Long oldGroupId = user.getGroup().getId();

        // Si ya está solo, no hay de qué salir
        if (userRepository.countByGroupId(oldGroupId) <= 1) {
            throw new AlreadyAloneException();
        }

        Group personal = new Group();
        personal.setName(user.getUsername() + "'s group");
        personal.setInviteCode(inviteCodeGenerator.generateUnique());
        groupRepository.save(personal);

        user.setGroup(personal);
        userRepository.save(user);

        return new GroupDTO(personal.getId(), personal.getName());
    }
}