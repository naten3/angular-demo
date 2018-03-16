package com.natenelles.timeapp.model;

import java.util.Optional;

public class SuccessResponse {
    private boolean success;
    private Optional<String> message;

    public SuccessResponse(boolean success, Optional<String> message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public Optional<String> getMessage() {
        return message;
    }
}
