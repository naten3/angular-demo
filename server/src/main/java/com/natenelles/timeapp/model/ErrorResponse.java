package com.natenelles.timeapp.model;

import java.util.Optional;
import java.util.Set;

public class ErrorResponse<T> {
    private Set<T> errors;

    public ErrorResponse(Set<T> errors) {
        this.errors = errors;
    }

    public Set<T> getErrors() {
        return errors;
    }
}
