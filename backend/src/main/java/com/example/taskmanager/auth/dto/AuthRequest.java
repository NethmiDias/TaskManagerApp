package com.example.taskmanager.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthRequest(
    @NotBlank @Size(max = 50) String username,
    @NotBlank @Size(min = 6, max = 100) String password) {}

