package com.example.taskmanager.auth;

import com.example.taskmanager.api.ConflictException;
import com.example.taskmanager.auth.dto.AuthRequest;
import com.example.taskmanager.auth.dto.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
  private final UserRepository users;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwt;

  @Transactional
  public AuthResponse register(AuthRequest req) {
    String username = req.username().trim();
    if (users.existsByUsername(username)) {
      throw new ConflictException("Username already exists");
    }

    AppUser u =
        AppUser.builder()
            .username(username)
            .passwordHash(passwordEncoder.encode(req.password()))
            .build();
    users.save(u);

    String token = jwt.generateToken(username);
    return new AuthResponse(token, username);
  }

  @Transactional(readOnly = true)
  public AuthResponse login(AuthRequest req) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(req.username(), req.password()));
    String token = jwt.generateToken(req.username());
    return new AuthResponse(token, req.username());
  }
}

