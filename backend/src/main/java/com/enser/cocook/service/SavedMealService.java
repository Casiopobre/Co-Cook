package com.enser.cocook.service;

import com.enser.cocook.dto.meal.MealDTO;
import com.enser.cocook.exception.MealNotFoundException;
import com.enser.cocook.exception.NotResourceOwnerException;
import com.enser.cocook.model.Meal;
import com.enser.cocook.model.SavedMeal;
import com.enser.cocook.model.User;
import com.enser.cocook.repository.MealPlanRepository;
import com.enser.cocook.repository.MealRepository;
import com.enser.cocook.repository.SavedMealRepository;
import com.enser.cocook.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedMealService {

    private final SavedMealRepository savedMealRepository;
    private final MealRepository mealRepository;
    private final MealPlanRepository mealPlanRepository;
    private final UserRepository userRepository;

    public List<MealDTO> list(Long userId, String q, int limit, User principal) {
        requireSelf(userId, principal);
        Pageable pageable = PageRequest.of(0, Math.clamp(limit, 1, 100));
        return savedMealRepository.search(userId, q.trim(), pageable)
                .stream().map(MealDTO::from).toList();
    }

    @Transactional
    public MealDTO save(Long userId, Long mealId, User principal) {
        requireSelf(userId, principal);

        Meal meal = mealRepository.findById(mealId).orElseThrow(MealNotFoundException::new);

        boolean alreadySaved = savedMealRepository.existsByUserIdAndMealId(userId, mealId);
        boolean plannedInMyGroup =
                mealPlanRepository.existsByGroupIdAndMealId(principal.getGroup().getId(), mealId);

        // Se puede guardar el catálogo, lo que ya tienes o lo que ves en el calendario de tu grupo
        if (!alreadySaved && !plannedInMyGroup && !meal.isFromCatalog()) {
            throw new MealNotFoundException();
        }

        // Idempotente: guardar dos veces lo mismo no es un error
        if (!alreadySaved) {
            savedMealRepository.save(new SavedMeal(userRepository.getReferenceById(userId), meal));
        }
        return MealDTO.from(meal);
    }

    @Transactional
    public void remove(Long userId, Long mealId, User principal) {
        requireSelf(userId, principal);
        savedMealRepository.deleteByUserIdAndMealId(userId, mealId);
    }

    private void requireSelf(Long userId, User principal) {
        if (!principal.getId().equals(userId)) throw new NotResourceOwnerException();
    }
}