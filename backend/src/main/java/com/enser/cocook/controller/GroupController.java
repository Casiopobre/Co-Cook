package com.enser.cocook.controller;

import com.enser.cocook.dto.UserDTO;
import com.enser.cocook.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @GetMapping("/{id}/members}")
    public ResponseEntity<List<UserDTO>> getMembers(@PathVariable("id") Long id) {
        return ResponseEntity.ok(groupService.getMembers(id));
    }
}
