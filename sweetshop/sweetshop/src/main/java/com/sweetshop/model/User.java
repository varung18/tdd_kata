package com.sweetshop.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
public class User {
    @org.springframework.data.annotation.Id
    private String Id;
    private String username;
    private String password;
    // above 3 variables mention their role by its name...

    private String role; // there will be 2 different roles, user and admin

    //using a spring plugin lombok to reduce boilerplate for getters and setters
}
