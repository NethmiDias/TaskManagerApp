package com.example.taskmanager.auth;

import com.example.taskmanager.auth.dto.AuthRequest;
import com.example.taskmanager.auth.dto.AuthResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
  private final AuthService auth;

  @PostMapping("/register")
  public AuthResponse register(@Valid @RequestBody AuthRequest req) {
    return auth.register(req);
  }

  @PostMapping("/login")
  public AuthResponse login(@Valid @RequestBody AuthRequest req) {
    return auth.login(req);
  }
}

