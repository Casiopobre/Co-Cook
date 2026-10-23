package com.enser.cocook.service;

import com.enser.cocook.dto.meal.CreateMealRequest;
import com.enser.cocook.dto.meal.IngredientRequest;
import com.enser.cocook.dto.meal.MealDTO;
import com.enser.cocook.exception.InvalidMealException;
import com.enser.cocook.exception.MealNameAlreadyExistsException;
import com.enser.cocook.exception.MealNotFoundException;
import com.enser.cocook.model.Meal;
import com.enser.cocook.model.MealIngredient;
import com.enser.cocook.model.User;
import com.enser.cocook.repository.GroupRepository;
import com.enser.cocook.repository.MealRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NullMarked;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@NullMarked
@RequiredArgsConstructor
public class MealService {

    private final MealRepository mealRepository;
    private final GroupRepository groupRepository;

    public List<MealDTO> search(String q, int limit, User principal) {
        Pageable pageable = PageRequest.of(0, Math.clamp(limit, 1, 50));
        return mealRepository.search(principal.getGroup().getId(), q.trim(), pageable)
                .stream().map(MealDTO::from).toList();
    }

    public MealDTO findById(long id, User principal) {
        Meal meal = mealRepository.findById(id).orElseThrow(MealNotFoundException::new);

        boolean visible = meal.getGroup() == null
                || meal.getGroup().getId().equals(principal.getGroup().getId());
        if (!visible) throw new MealNotFoundException();

        return MealDTO.from(meal);
    }

    public List<MealDTO> getMealsByGroup(User principal) {
        return mealRepository.findByGroupId(principal.getGroup().getId())
                .stream().map(MealDTO::from).toList();
    }

    @Transactional
    public MealDTO create(CreateMealRequest request, User principal) {
        Long groupId = principal.getGroup().getId();
        String name = request.name().trim();

        if (mealRepository.existsByGroupIdAndNameIgnoreCase(groupId, name)) {
            throw new MealNameAlreadyExistsException(name);
        }

        Meal meal = new Meal();
        meal.setName(name);
        meal.setGroup(groupRepository.getReferenceById(groupId)); // referencia por id, sin consulta

        boolean composite = request.ingredients() != null && !request.ingredients().isEmpty();
        if (composite) {
            fillFromIngredients(meal, request.ingredients(), groupId);
        } else {
            fillFromValues(meal, request);
        }

        return MealDTO.from(mealRepository.save(meal));
    }

    private void fillFromValues(Meal meal, CreateMealRequest r) {
        if (r.kcalPer100g() == null || r.carbsPer100g() == null
                || r.proteinsPer100g() == null || r.fatsPer100g() == null) {
            throw new InvalidMealException(
                    "Indica los valores por 100 g, o añade ingredientes");
        }
        meal.setKcalPer100g(r.kcalPer100g());
        meal.setCarbsPer100g(r.carbsPer100g());
        meal.setProteinsPer100g(r.proteinsPer100g());
        meal.setFatsPer100g(r.fatsPer100g());
    }


    private void fillFromIngredients(Meal meal, List<IngredientRequest> items, Long groupId) {
        List<Long> ids = items.stream().map(IngredientRequest::ingredientId).toList();
        if (new HashSet<>(ids).size() != ids.size()) {
            throw new InvalidMealException("Un ingrediente no puede aparecer dos veces");
        }

        Map<Long, Meal> found = mealRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Meal::getId, Function.identity()));

        double kcal = 0, carbs = 0, proteins = 0, fats = 0;
        int totalGrams = 0;

        for (IngredientRequest item : items) {
            Meal ingredient = found.get(item.ingredientId());

            // Solo se pueden usar comidas globales o del propio grupo
            boolean usable = ingredient != null
                    && (ingredient.getGroup() == null
                    || ingredient.getGroup().getId().equals(groupId));
            if (!usable) {
                throw new InvalidMealException("Ingrediente no encontrado: " + item.ingredientId());
            }

            double factor = item.quantityGrams() / 100.0; // por cada 100 gramos
            kcal += ingredient.getKcalPer100g() * factor;
            carbs += ingredient.getCarbsPer100g() * factor;
            proteins += ingredient.getProteinsPer100g() * factor;
            fats += ingredient.getFatsPer100g() * factor;
            totalGrams += item.quantityGrams();

            MealIngredient row = new MealIngredient();
            row.setMeal(meal);
            row.setIngredient(ingredient);
            row.setQuantityGrams(item.quantityGrams());
            meal.getIngredients().add(row);
        }

        // Lo acumulado es el total de la receta; se convierte a "por 100 g del plato"
        double per100 = 100.0 / totalGrams;
        meal.setKcalPer100g(round1(kcal * per100));
        meal.setCarbsPer100g(round1(carbs * per100));
        meal.setProteinsPer100g(round1(proteins * per100));
        meal.setFatsPer100g(round1(fats * per100));
    }

    private double round1(double v) {
        return Math.round(v * 10) / 10.0;
    }
}
