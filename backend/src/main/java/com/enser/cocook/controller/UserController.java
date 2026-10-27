package com.enser.cocook.controller;

import com.enser.cocook.dto.UserDTO;
import com.enser.cocook.dto.group.GroupDTO;
import com.enser.cocook.dto.group.JoinGroupRequest;
import com.enser.cocook.dto.meal.MealDTO;
import com.enser.cocook.model.User;
import com.enser.cocook.service.GroupService;
import com.enser.cocook.service.SavedMealService;
import com.enser.cocook.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final GroupService groupService;
    private final SavedMealService savedMealService;

    @PostMapping(value = "/{userId}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDTO> uploadAvatar(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(userService.updateAvatar(userId, user, file));
    }

    @PutMapping("/{userId}/group")
    public ResponseEntity<GroupDTO> changeGroup(
            @PathVariable Long userId,
            @Valid @RequestBody JoinGroupRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(groupService.join(userId, request, user));
    }

    @GetMapping("/{userId}/meals")
    public ResponseEntity<List<MealDTO>> myMeals(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "50") int limit,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(savedMealService.list(userId, q, limit, user));
    }

    @PutMapping("/{userId}/meals/{mealId}")
    public ResponseEntity<MealDTO> saveMeal(
            @PathVariable Long userId, @PathVariable Long mealId, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(savedMealService.save(userId, mealId, user));
    }

    @DeleteMapping("/{userId}/meals/{mealId}")
    public ResponseEntity<Void> unsaveMeal(
            @PathVariable Long userId, @PathVariable Long mealId, @AuthenticationPrincipal User user) {
        savedMealService.remove(userId, mealId, user);
        return ResponseEntity.noContent().build();
    }
}
