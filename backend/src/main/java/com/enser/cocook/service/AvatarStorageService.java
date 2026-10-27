package com.enser.cocook.service;

import com.enser.cocook.exception.InvalidImageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class AvatarStorageService {

    private static final String URL_PREFIX = "/uploads/avatars/";

    private final Path avatarDir;

    public AvatarStorageService(@Value("${app.upload-dir}") String uploadDir) throws IOException {
        this.avatarDir = Paths.get(uploadDir, "avatars").toAbsolutePath().normalize();
        Files.createDirectories(avatarDir);
    }

    /** Guarda la imagen y devuelve la ruta pública, p. ej. /uploads/avatars/3f2a...jpg */
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidImageException("No se ha enviado ninguna imagen");
        }

        try {
            byte[] bytes = file.getBytes();
            String extension = detectExtension(bytes);
            String filename = UUID.randomUUID() + "." + extension;
            Files.write(avatarDir.resolve(filename), bytes);
            return URL_PREFIX + filename;
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    /** Borra una foto anterior; ignora rutas que no sean de avatares (p. ej. la imagen por defecto) */
    public void deleteQuietly(String imageRoute) {
        if (imageRoute == null || !imageRoute.startsWith(URL_PREFIX)) return;

        Path target = avatarDir.resolve(imageRoute.substring(URL_PREFIX.length())).normalize();
        if (!target.startsWith(avatarDir)) return;

        try {
            Files.deleteIfExists(target);
        } catch (IOException ignored) {
            // un archivo huérfano no justifica fallar la petición
        }
    }

    // Se identifica el formato por los primeros bytes, no por el nombre ni el Content-Type,
    // que el cliente puede falsear
    private String detectExtension(byte[] b) {
        if (b.length >= 3 && (b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF) {
            return "jpg";
        }
        if (b.length >= 8 && (b[0] & 0xFF) == 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G'
                && b[4] == 0x0D && b[5] == 0x0A && b[6] == 0x1A && b[7] == 0x0A) {
            return "png";
        }
        if (b.length >= 12 && b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F'
                && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P') {
            return "webp";
        }
        throw new InvalidImageException("Formato no válido. Usa JPG, PNG o WebP");
    }
}