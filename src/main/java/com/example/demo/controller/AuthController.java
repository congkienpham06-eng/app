package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional; // ← bắt buộc

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://127.0.0.1:5500") // cho phép frontend này
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        if(user.getUsername() == null || user.getUsername().isEmpty() ||
           user.getPassword() == null || user.getPassword().isEmpty()) {
            return "Username and password cannot be empty!";
        }

        Optional<User> existing = userRepository.findByUsername(user.getUsername());
        if (existing.isPresent()) {
            return "Username already exists!";
        }

        userRepository.save(user);
        return "Register successful!";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        if(user.getUsername() == null || user.getUsername().isEmpty() ||
           user.getPassword() == null || user.getPassword().isEmpty()) {
            return "Username and password cannot be empty!";
        }

        Optional<User> existing = userRepository.findByUsername(user.getUsername());
        if (existing.isPresent() && existing.get().getPassword().equals(user.getPassword())) {
            return "Login successful!";
        } else {
            return "Invalid username or password!";
        }
    }
}
