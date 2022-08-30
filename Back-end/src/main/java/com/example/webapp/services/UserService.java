package com.example.webapp.services;

import com.example.webapp.models.User;
import com.example.webapp.payloads.response.MessageRes;
import com.example.webapp.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder encoder;

    public UserService(UserRepository userRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    public List<User> getUsers(){
        return userRepository.findAll();
    }

    public ResponseEntity<MessageRes> changeEmail(String currEmail, String newEmail){
        if(userRepository.existsByEmail(currEmail)){
            User user = userRepository.findByEmail(currEmail);
            if(newEmail.equals(user.getEmail())){
                return ResponseEntity.badRequest().body(new MessageRes("Your Email is already: "+currEmail+". Enter a different email to change the current one."));
            }
            if(userRepository.existsByEmail(newEmail)){
                return ResponseEntity.badRequest().body(new MessageRes("This email is already in use"));
            }
            else {
                user.setEmail(newEmail);
                userRepository.save(user);
                return ResponseEntity.ok().body(new MessageRes("Email changed successfully"));
            }
        }
        else{ return ResponseEntity.badRequest().body(new MessageRes("Could not find user with email: "+currEmail));}
    }

    public ResponseEntity<MessageRes> changePassword(String currentPass, String newPass, String email){
        if(userRepository.existsByEmail(email)){
            User user = userRepository.findByEmail(email);
            if(encoder.matches(currentPass, user.getPassword())) {
                if (encoder.matches(newPass, user.getPassword())) {
                    return ResponseEntity.badRequest().body(new MessageRes("Please choose a password that is different to your current password"));
                }
                user.setPassword(encoder.encode(newPass));
                userRepository.save(user);
                return ResponseEntity.ok().body(new MessageRes("Password changed successfully"));
            }
            else {
                return ResponseEntity.badRequest().body(new MessageRes("Incorrect password"));
            }

        }
        else{
            return ResponseEntity.badRequest().body(new MessageRes("Could not find user with email: "+email));
        }
    }
}
