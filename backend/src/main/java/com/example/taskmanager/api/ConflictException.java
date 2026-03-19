package com.example.taskmanager.api;

public class ConflictException extends RuntimeException {
  public ConflictException(String message) {
    super(message);
  }
}

