package com.example.taskmanager.api;

import java.time.Instant;
import lombok.Builder;

@Builder
public record ApiError(Instant timestamp, int status, String error, String message, String path) {}

