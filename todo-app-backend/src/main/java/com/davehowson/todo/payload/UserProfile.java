package com.davehowson.todo.payload;

import com.davehowson.todo.model.Task;

import java.time.Instant;
import java.util.List;

public class UserProfile {

    private Long id;
    private String username;
    private String name;
    private Instant joinedAt;
    private int taskCount;

    public UserProfile(Long id, String username, String name, Instant joinedAt, int taskCount) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.joinedAt = joinedAt;
        this.taskCount = taskCount;
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

    public int getTaskCount() {
        return taskCount;
    }

    public void setTaskCount(int taskCount) {
        this.taskCount = taskCount;
    }
}
