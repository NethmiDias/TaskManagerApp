package com.example.taskmanager.task;

import com.example.taskmanager.api.NotFoundException;
import com.example.taskmanager.auth.AppUser;
import com.example.taskmanager.auth.UserRepository;
import com.example.taskmanager.task.dto.TaskRequest;
import com.example.taskmanager.task.dto.TaskResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskService {
  private final TaskRepository repo;
  private final UserRepository users;

  // ── resolve the logged-in user's DB id ───────────────────────────────────
  private Long currentUserId() {
    String username = SecurityContextHolder.getContext()
            .getAuthentication().getName();
    return users.findByUsername(username)
            .map(AppUser::getId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
  }

  @Transactional(readOnly = true)
  public List<TaskResponse> getAll() {
    return repo
            .findAllByUserId(currentUserId(), Sort.by(Sort.Direction.DESC, "createdAt"))
            .stream()
            .map(TaskService::toDto)
            .toList();
  }

  @Transactional(readOnly = true)
  public TaskResponse getById(Long id) {
    return toDto(getEntity(id));
  }

  @Transactional
  public TaskResponse create(TaskRequest req) {
    Task t = Task.builder()
            .title(req.title().trim())
            .description(blank(req.description()))
            .status(req.status())
            .userId(currentUserId())
            .build();
    return toDto(repo.save(t));
  }

  @Transactional
  public TaskResponse update(Long id, TaskRequest req) {
    Task t = getEntity(id);
    t.setTitle(req.title().trim());
    t.setDescription(blank(req.description()));
    t.setStatus(req.status());
    return toDto(repo.save(t));
  }

  @Transactional
  public void delete(Long id) {
    if (!repo.existsByIdAndUserId(id, currentUserId())) {
      throw new NotFoundException("Task not found");
    }
    repo.deleteById(id);
  }

  // ── helpers ──────────────────────────────────────────────────────────────
  private Task getEntity(Long id) {
    return repo.findByIdAndUserId(id, currentUserId())
            .orElseThrow(() -> new NotFoundException("Task not found"));
  }

  private static String blank(String s) {
    return (s == null || s.isBlank()) ? null : s.trim();
  }

  private static TaskResponse toDto(Task t) {
    return new TaskResponse(
            t.getId(), t.getTitle(), t.getDescription(), t.getStatus(), t.getCreatedAt());
  }
}