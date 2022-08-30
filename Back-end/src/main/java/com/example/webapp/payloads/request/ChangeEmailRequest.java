package com.example.webapp.payloads.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class ChangeEmailRequest {

    @NotBlank
    @Size(max = 40)
    @Email
    private String currentEmail;

    @NotBlank
    @Size(max = 40)
    @Email
    private String newEmail;

    public String getCurrentEmail() {
        return currentEmail;
    }

    public void setCurrentEmail(String currentEmail) {
        this.currentEmail = currentEmail;
    }

    public String getNewEmail() {
        return newEmail;
    }

    public void setNewEmail(String newEmail) {
        this.newEmail = newEmail;
    }
}
