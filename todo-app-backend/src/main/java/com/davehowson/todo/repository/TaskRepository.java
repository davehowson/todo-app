package com.davehowson.todo.repository;

import com.davehowson.todo.model.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    Optional<Task> findById(Long userId);

    Page<Task> findByCreatedBy(Long userId, Pageable pageable);

    long countByCreatedBy(Long userId);

    List<Task> findByIdIn(List<Long> taskIds);

    List<Task> findByIdIn(List<Long> pollIds, Sort sort);
}
