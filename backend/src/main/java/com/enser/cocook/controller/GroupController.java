package com.enser.cocook.controller;

import com.enser.cocook.dto.group.GroupDTO;
import com.enser.cocook.dto.UserDTO;
import com.enser.cocook.dto.group.InviteCodeResponse;
import com.enser.cocook.dto.group.JoinGroupRequest;
import com.enser.cocook.model.User;
import com.enser.cocook.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<UserDTO>> getMembers(
            @PathVariable Long groupId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(groupService.getMembers(groupId, user));
    }

    @GetMapping("/{groupId}/invite-code")
    public ResponseEntity<InviteCodeResponse> getInviteCode(
            @PathVariable Long groupId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(groupService.getInviteCode(groupId, user));
    }
}