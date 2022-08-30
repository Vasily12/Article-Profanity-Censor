package com.example.webapp.payloads.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class ChangePassRequest {

    @NotBlank
    @Size(min = 5,max = 20)
    private String currentPassword;

    @NotBlank
    @Size(min = 5,max = 20)
    private String newPassword;

    @NotBlank
    @Size(max = 40)
    @Email
    private String email;

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
