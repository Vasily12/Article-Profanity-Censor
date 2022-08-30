package com.example.webapp.controllers;

import com.example.webapp.models.User;
import com.example.webapp.payloads.request.*;
import com.example.webapp.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;


@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<User> getAllUsers(){
        return userService.getUsers();
    }

    @PostMapping("/change/email")
    public ResponseEntity<?> changeUserEmail(@Valid @RequestBody ChangeEmailRequest changeEmailRequest){
        return userService.changeEmail(changeEmailRequest.getCurrentEmail(),changeEmailRequest.getNewEmail());
    }

    @PostMapping("/change/password")
    public ResponseEntity<?> changeUserPassword(@Valid @RequestBody ChangePassRequest changePassRequest){
        return userService.changePassword(
                changePassRequest.getCurrentPassword(),
                changePassRequest.getNewPassword(),
                changePassRequest.getEmail()
                );
    }
}
