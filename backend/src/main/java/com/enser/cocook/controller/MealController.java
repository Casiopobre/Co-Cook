package com.enser.cocook.controller;

import com.enser.cocook.dto.meal.MealDTO;
import com.enser.cocook.dto.meal.CreateMealRequest;
import com.enser.cocook.model.User;
import com.enser.cocook.service.MealService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/meals")
@RequiredArgsConstructor
public class MealController {

    private final MealService mealService;

    // Busca en el catálogo público. Tu colección está en GET /users/{userId}/meals
    @GetMapping
    public ResponseEntity<List<MealDTO>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "20") int limit
    ) {
        return ResponseEntity.ok(mealService.searchCatalog(q, limit));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MealDTO> byId(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(mealService.findById(id, user));
    }

    @PostMapping
    public ResponseEntity<MealDTO> create(
            @Valid @RequestBody CreateMealRequest request,
            @AuthenticationPrincipal User user
    ) {
        MealDTO created = mealService.create(request, user);
        return ResponseEntity.created(URI.create("/meals/" + created.id())).body(created);
    }
}