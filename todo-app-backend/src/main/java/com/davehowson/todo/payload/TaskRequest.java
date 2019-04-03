package com.davehowson.todo.payload;


import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDate;

public class TaskRequest {

    @NotBlank
    @Size(max = 200)
    private String name;

    @NotBlank
    private String date;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDate() {
        LocalDate localDate = LocalDate.parse(date);
        return localDate;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
