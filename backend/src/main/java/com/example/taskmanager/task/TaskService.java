package com.example.taskmanager.task;

import com.example.taskmanager.api.NotFoundException;
import com.example.taskmanager.task.dto.TaskRequest;
import com.example.taskmanager.task.dto.TaskResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskService {
  private final TaskRepository repo;

  @Transactional(readOnly = true)
  public List<TaskResponse> getAll() {
    return repo.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream().map(TaskService::toDto).toList();
  }

  @Transactional(readOnly = true)
  public TaskResponse getById(Long id) {
    return toDto(getEntity(id));
  }

  @Transactional
  public TaskResponse create(TaskRequest req) {
    Task t =
        Task.builder()
            .title(req.title().trim())
            .description(req.description() == null || req.description().isBlank() ? null : req.description().trim())
            .status(req.status())
            .build();
    return toDto(repo.save(t));
  }

  @Transactional
  public TaskResponse update(Long id, TaskRequest req) {
    Task t = getEntity(id);
    t.setTitle(req.title().trim());
    t.setDescription(req.description() == null || req.description().isBlank() ? null : req.description().trim());
    t.setStatus(req.status());
    return toDto(repo.save(t));
  }

  @Transactional
  public void delete(Long id) {
    if (!repo.existsById(id)) {
      throw new NotFoundException("Task not found");
    }
    repo.deleteById(id);
  }

  private Task getEntity(Long id) {
    return repo.findById(id).orElseThrow(() -> new NotFoundException("Task not found"));
  }

  private static TaskResponse toDto(Task t) {
    return new TaskResponse(t.getId(), t.getTitle(), t.getDescription(), t.getStatus(), t.getCreatedAt());
  }
}

