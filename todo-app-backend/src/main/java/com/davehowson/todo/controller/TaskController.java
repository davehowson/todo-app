package com.davehowson.todo.controller;

import com.davehowson.todo.model.Task;
import com.davehowson.todo.payload.*;
import com.davehowson.todo.repository.TaskRepository;
import com.davehowson.todo.repository.UserRepository;
import com.davehowson.todo.security.CurrentUser;
import com.davehowson.todo.security.UserPrincipal;
import com.davehowson.todo.service.TaskService;
import com.davehowson.todo.util.AppConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskService taskService;

    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);

    @GetMapping
    public PagedResponse<TaskResponse> getTasks(@CurrentUser UserPrincipal currentUser,
                                                @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return taskService.getTasksCreatedBy(currentUser, page, size);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createTask(@Valid @RequestBody TaskRequest taskRequest,
                                        @CurrentUser UserPrincipal currentUser ) {
        Task task = taskService.createTask(taskRequest, currentUser.getUsername());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{taskId}")
                .buildAndExpand(task.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "Task Created Successfully"));
    }

    @PostMapping("/task/complete")
    public TaskCompleteResponse completeTask(@RequestBody TaskCompleteRequest taskCompleteRequest){
        return taskService.completeTask(taskCompleteRequest);
    }

}
