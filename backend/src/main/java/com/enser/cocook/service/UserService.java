package com.enser.cocook.service;

import com.enser.cocook.dto.UserDTO;
import com.enser.cocook.dto.group.GroupDTO;
import com.enser.cocook.exception.InvalidCredentialsException;
import com.enser.cocook.exception.NotResourceOwnerException;
import com.enser.cocook.model.User;
import com.enser.cocook.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AvatarStorageService avatarStorage;

    @Transactional
    public UserDTO updateAvatar(Long userId, User principal, MultipartFile file) {
        if (!principal.getId().equals(userId)) throw new NotResourceOwnerException();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(InvalidCredentialsException::new);

        String oldRoute = user.getImageRoute();
        user.setImageRoute(avatarStorage.store(file));
        userRepository.save(user);

        avatarStorage.deleteQuietly(oldRoute);
        return UserDTO.from(user);
    }
}