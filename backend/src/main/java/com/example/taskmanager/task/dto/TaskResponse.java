package com.example.taskmanager.task.dto;

import com.example.taskmanager.task.TaskStatus;
import java.time.LocalDateTime;

public record TaskResponse(
    Long id, String title, String description, TaskStatus status, LocalDateTime createdAt) {}

