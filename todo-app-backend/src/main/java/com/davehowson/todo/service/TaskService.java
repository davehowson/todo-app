package com.davehowson.todo.service;

import com.davehowson.todo.exception.BadRequestException;
import com.davehowson.todo.exception.ResourceNotFoundException;
import com.davehowson.todo.model.Task;
import com.davehowson.todo.model.User;
import com.davehowson.todo.payload.*;
import com.davehowson.todo.repository.TaskRepository;
import com.davehowson.todo.repository.UserRepository;
import com.davehowson.todo.security.CustomUserDetailsService;
import com.davehowson.todo.security.UserPrincipal;
import com.davehowson.todo.util.AppConstants;
import com.davehowson.todo.util.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

    public PagedResponse<TaskResponse> getAllTasks(UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        // Retrieve tasks
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Task> tasks = taskRepository.findAll(pageable);

        if(tasks.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), tasks.getNumber(),
                    tasks.getSize(), tasks.getTotalElements(), tasks.getTotalPages(), tasks.isLast());
        }

        List<Long> taskIds = tasks.map(Task::getId).getContent();
        Map<Long, User> creatorMap = getTaskCreatorMap(tasks.getContent());
        List<TaskResponse> taskResponses = tasks.map(ModelMapper::mapTasktoTaskResponse).getContent();

        return new PagedResponse<>(taskResponses, tasks.getNumber(), tasks.getSize(), tasks.getTotalElements(), tasks.getTotalPages(), tasks.isLast());
    }

    private void validatePageNumberAndSize(int page, int size) {
        if(page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if(size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }

    public PagedResponse<TaskResponse> getTasksCreatedBy(UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);
        String username = currentUser.getUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Retrieve all tasks created by the given username
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Task> tasks = taskRepository.findByCreatedByOrderByDateDesc(user.getId(), pageable);

        if (tasks.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), tasks.getNumber(),
                    tasks.getSize(), tasks.getTotalElements(), tasks.getTotalPages(), tasks.isLast());
        }

        List<TaskResponse> taskResponses = tasks.map(ModelMapper::mapTasktoTaskResponse).getContent();

        return new PagedResponse<>(taskResponses, tasks.getNumber(),
                tasks.getSize(), tasks.getTotalElements(), tasks.getTotalPages(), tasks.isLast());
    }

    Map<Long, User> getTaskCreatorMap(List<Task> tasks) {
        // Get Task Creator details of the given list of tasks
        List<Long> creatorIds = tasks.stream()
                .map(Task::getCreatedBy)
                .distinct()
                .collect(Collectors.toList());

        List<User> creators = userRepository.findByIdIn(creatorIds);
        Map<Long, User> creatorMap = creators.stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        return creatorMap;
    }

    public Task createTask(TaskRequest taskRequest, String username) {
        Task task = new Task();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        task.setName(taskRequest.getName());
        task.setDate(taskRequest.getDate());
        task.setUser(user);

        return taskRepository.save(task);
    }

    public TaskResponse getTaskById(Long taskId, UserPrincipal currentUser) {
        Task task = taskRepository.findById(taskId).orElseThrow(
                () -> new ResourceNotFoundException("Task", "id", taskId));


        // Retrieve poll creator details
        User creator = userRepository.findById(task.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", task.getCreatedBy()));

        return ModelMapper.mapTasktoTaskResponse(task);
    }

    public TaskCompleteResponse completeTask(TaskCompleteRequest taskCompleteRequest) {
        Task task = taskRepository.findById(taskCompleteRequest.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskCompleteRequest.getTaskId()));

        task.setComplete(taskCompleteRequest.isStatus());
        taskRepository.save(task);

        TaskCompleteResponse taskCompleteResponse = new TaskCompleteResponse();
        taskCompleteResponse.setTaskId(taskCompleteRequest.getTaskId());
        taskCompleteResponse.setStatus(taskCompleteRequest.isStatus());
        taskCompleteResponse.setMessage("Successfully Completed Task");

        return taskCompleteResponse;
    }

}
