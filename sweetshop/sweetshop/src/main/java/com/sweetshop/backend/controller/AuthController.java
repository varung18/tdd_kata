package com.sweetshop.backend.controller;


import com.sweetshop.backend.config.JwtUtil;
import com.sweetshop.backend.model.User;
import com.sweetshop.backend.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, AuthenticationManager authManager, JwtUtil jwtUtil) {
        this.userService = userService;
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public User register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String role = body.getOrDefault("role", "USER"); //default USER
        return userService.registerUser(username, password, role);
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> body){
        try{
            var auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(body.get("username"), body.get("password"))
            );

            String token = jwtUtil.generateToken(auth.getName(),
                    auth.getAuthorities().iterator().next().getAuthority());

            return Map.of("token", token);
        } catch (AuthenticationException e){
            return Map.of("error", "Invalid username or password");
        }
    }
}
