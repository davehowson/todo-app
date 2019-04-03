package com.davehowson.todo.payload;

import com.davehowson.todo.model.Task;

import java.time.Instant;
import java.util.List;

public class UserProfile {

    private Long id;
    private String username;
    private String name;
    private Instant joinedAt;
    private List<Task> tasks;

    public UserProfile(Long id, String username, String name, Instant joinedAt, List<Task> tasks) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.joinedAt = joinedAt;
        this.tasks = tasks;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Instant joinedAt) {
        this.joinedAt = joinedAt;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}
