package com.app.auth.service;

import com.app.auth.dto.AuthDto.*;
import com.app.auth.model.RefreshToken;
import com.app.auth.model.Role;
import com.app.auth.model.User;
import com.app.auth.repository.UserRepository;
import com.app.auth.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;

    // ── Register ───────────────────────────────────────────────────────────────
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Un compte existe déjà avec cet email");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        user = userRepository.save(user);
        log.info("New user registered: {}", user.getEmail());

        return buildAuthResponse(user);
    }

    // ── Login ──────────────────────────────────────────────────────────────────
    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Throws BadCredentialsException if invalid
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        log.info("User logged in: {}", user.getEmail());
        return buildAuthResponse(user);
    }

    // ── Refresh Token ──────────────────────────────────────────────────────────
    @Transactional
    public AuthResponse refresh(RefreshRequest request) {
        RefreshToken refreshToken = refreshTokenService
                .findByToken(request.getRefreshToken())
                .orElseThrow(() -> new IllegalArgumentException("Token de rafraîchissement invalide"));

        if (!refreshToken.isValid()) {
            throw new IllegalArgumentException("Token de rafraîchissement expiré ou révoqué");
        }

        User user = refreshToken.getUser();
        return buildAuthResponse(user);
    }

    // ── Logout ─────────────────────────────────────────────────────────────────
    @Transactional
    public void logout(User user) {
        refreshTokenService.revokeAllByUser(user);
        log.info("User logged out: {}", user.getEmail());
    }

    // ── Helpers ────────────────────────────────────────────────────────────────
    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpirationMs())
                .user(UserResponse.from(user))
                .build();
    }
}
