package com.example.webapp.payloads.request;

public class DeleteSavedArticleRequest {

    private String email;
    private String title;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
