package com.example.webapp.controllers;

import com.example.webapp.models.ERole;
import com.example.webapp.models.Role;
import com.example.webapp.models.User;
import com.example.webapp.payloads.request.SignInRequest;
import com.example.webapp.payloads.request.SignUpRequest;
import com.example.webapp.payloads.response.JwtRes;
import com.example.webapp.payloads.response.MessageRes;
import com.example.webapp.repositories.RoleRepository;
import com.example.webapp.repositories.UserRepository;
import com.example.webapp.security.jwt_authentication.JwtUtils;
import com.example.webapp.security.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody SignInRequest signInRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        signInRequest.getUsername(),
                        signInRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails
                .getAuthorities()
                .stream().map(role -> role.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtRes(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles
        ));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> createNewUser(@Valid @RequestBody SignUpRequest signUpRequest){

        if (userRepository.existsByUsername(signUpRequest.getUsername())){
            return ResponseEntity.badRequest().body(new MessageRes("Username already taken"));
        }
        if (userRepository.existsByEmail(signUpRequest.getEmail())){
            return ResponseEntity.badRequest().body(new MessageRes("Email already in use"));
        }

        User user = new User(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword())
                );

        Set<String> hasRole = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (hasRole == null){
            Role userRole = roleRepository
                    .findByRole(ERole.ROLE_USER)
                    .orElseThrow(()-> new RuntimeException("Role not found"));
            roles.add(userRole);
        }
        else{
            hasRole.forEach(role -> {
                switch (role){
                    case "admin":
                        Role adminRole = roleRepository
                                .findByRole(ERole.ROLE_ADMIN)
                                .orElseThrow(()-> new RuntimeException("Role not found"));
                        roles.add(adminRole);
                        break;

                    default:
                        Role userRole = roleRepository
                                .findByRole(ERole.ROLE_USER)
                                .orElseThrow(()-> new RuntimeException("Role not found"));
                        roles.add(userRole);
                }
            });
        }
        user.setRoles(roles);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageRes("Registered Successfully"));
    }
}
