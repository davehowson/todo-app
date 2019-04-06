package com.davehowson.todo.payload;

import javax.validation.constraints.NotNull;

public class TaskCompleteRequest {

    @NotNull
    private long taskId;

    @NotNull
    private boolean status;

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
}
