package com.example.taskmanager.task.dto;

import com.example.taskmanager.task.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TaskRequest(
    @NotBlank @Size(max = 120) String title,
    @Size(max = 2000) String description,
    @NotNull TaskStatus status) {}

