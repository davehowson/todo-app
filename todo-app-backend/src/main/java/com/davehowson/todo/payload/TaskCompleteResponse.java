package com.davehowson.todo.payload;

import javax.validation.constraints.NotNull;

public class TaskCompleteResponse {

    @NotNull
    private long taskId;

    @NotNull
    private boolean status;

    @NotNull
    private String message;

    public long getTaskId() {
        return taskId;
    }

    public void setTaskId(long taskId) {
        this.taskId = taskId;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
