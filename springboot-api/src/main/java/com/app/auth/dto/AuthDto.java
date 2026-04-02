package com.app.auth.dto;

import com.app.auth.model.User;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.Instant;

// ─── Auth Requests ────────────────────────────────────────────────────────────

public class AuthDto {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor(access = AccessLevel.PRIVATE)  @Builder
    public static class LoginRequest {
        @NotBlank(message = "L'email est requis")
        @Email(message = "Format d'email invalide")
        private String email;

        @NotBlank(message = "Le mot de passe est requis")
        @Size(min = 6, message = "Minimum 6 caractères")
        private String password;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor(access = AccessLevel.PRIVATE)  @Builder
    public static class RegisterRequest {
        @NotBlank(message = "Le prénom est requis")
        @Size(min = 2, max = 60)
        private String firstName;

        @NotBlank(message = "Le nom est requis")
        @Size(min = 2, max = 60)
        private String lastName;

        @NotBlank(message = "L'email est requis")
        @Email(message = "Format d'email invalide")
        private String email;

        @NotBlank(message = "Le mot de passe est requis")
        @Size(min = 8, message = "Minimum 8 caractères")
        @Pattern(regexp = ".*[A-Z].*", message = "Au moins une majuscule")
        @Pattern(regexp = ".*[0-9].*", message = "Au moins un chiffre")
        private String password;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor(access = AccessLevel.PRIVATE)  @Builder
    public static class RefreshRequest {
        @NotBlank
        private String refreshToken;
    }

    // ─── Auth Response ────────────────────────────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor(access = AccessLevel.PRIVATE)  @Builder
    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
        @Builder.Default
        private String tokenType = "Bearer";
        private long expiresIn;
        private UserResponse user;
    }

    // ─── User Response ────────────────────────────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor(access = AccessLevel.PRIVATE)  @Builder
    public static class UserResponse {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String role;
        private Instant createdAt;
        private String avatarUrl;

        public static UserResponse from(User user) {
            return UserResponse.builder()
                    .id(user.getId())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .createdAt(user.getCreatedAt())
                    .avatarUrl(user.getAvatarUrl())
                    .build();
        }
    }

    // ─── Update Profile Request ───────────────────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor(access = AccessLevel.PRIVATE)  @Builder
    public static class UpdateProfileRequest {
        @Size(min = 2, max = 60)
        private String firstName;

        @Size(min = 2, max = 60)
        private String lastName;
    }

    // ─── Error Response ───────────────────────────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor(access = AccessLevel.PRIVATE)  @Builder
    public static class ErrorResponse {
        private int status;
        private String message;
        private java.util.Map<String, String> errors;
        private Instant timestamp = Instant.now();
    }
}
