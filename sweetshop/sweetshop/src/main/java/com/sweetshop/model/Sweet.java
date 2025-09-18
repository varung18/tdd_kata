package com.sweetshop.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "sweets")
@Data
public class Sweet {
    @Id
    private String id;
    private String name;
    private String category;
    private double price;
    private int quantity;

    //using a spring plugin lombok to reduce boilerplate for getters and setters
}
