package com.shopflow.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class UserDto {

    @Data
    public static class RegisterRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @Email(message = "Valid email is required")
        @NotBlank(message = "Email is required")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;
    }

    @Data
    public static class LoginRequest {
        @Email
        @NotBlank
        private String email;

        @NotBlank
        private String password;
    }

    @Data
    public static class UpdateRequest {
        private String name;

        @Email
        private String email;

        private String password;
    }

    @Data
    public static class UserResponse {
        private Long id;
        private String name;
        private String email;
        private String role;
        private boolean enabled;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String type = "Bearer";
        private Long userId;
        private String name;
        private String email;
        private String role;

        public AuthResponse(String token, Long userId, String name, String email, String role) {
            this.token = token;
            this.userId = userId;
            this.name = name;
            this.email = email;
            this.role = role;
        }
    }
}
