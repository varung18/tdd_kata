package com.sweetshop.backend.model;

import lombok.Data;
import org.bson.types.Binary;
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

    //Media
    private Binary photo;
    private Binary video;

    //using a spring plugin lombok to reduce boilerplate for getters and setters

}
