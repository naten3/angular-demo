package com.natenelles.timeapp.model;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public class SuccessResponse<T> {
    private boolean success;
    private Optional<Set<T>> errors;

    public SuccessResponse(boolean success, Optional<Set<T>> errors) {
        this.success = success;
        this.errors = errors;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Optional<Set<T>> getErrors() {
        return errors;
    }

    public void setErrors(Optional<Set<T>> errors) {
        this.errors = errors;
    }
}
