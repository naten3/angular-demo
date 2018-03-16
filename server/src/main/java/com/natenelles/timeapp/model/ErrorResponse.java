package com.natenelles.timeapp.model;


import java.util.List;

public class ErrorResponse<T> {

    private List<String> errors;

    public ErrorResponse(List<String> errors) {
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
}
