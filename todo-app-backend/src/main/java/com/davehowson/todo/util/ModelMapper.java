package com.davehowson.todo.util;

import com.davehowson.todo.model.Task;
import com.davehowson.todo.model.User;
import com.davehowson.todo.payload.TaskResponse;
import com.davehowson.todo.payload.UserSummary;

public class ModelMapper {

    public static TaskResponse mapTasktoTaskResponse(Task task) {
        TaskResponse taskResponse = new TaskResponse();
        taskResponse.setId(task.getId());
        taskResponse.setName(task.getName());
        taskResponse.setDate(task.getDate());
        taskResponse.setComplete(task.isComplete());
        User user = task.getUser();
        UserSummary summary = new UserSummary(user.getId(), user.getUsername(), user.getName());
        taskResponse.setCreatedBy(summary);

        return taskResponse;
    }
}
