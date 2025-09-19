package com.sweetshop.backend.service;


import com.sweetshop.backend.model.Sweet;
import com.sweetshop.backend.repository.SweetRepository;
import org.bson.types.Binary;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class SweetService {

    private final SweetRepository sweetRepository;
    private final MongoTemplate mongoTemplate;

    public SweetService(SweetRepository sweetRepository, MongoTemplate mongoTemplate){
        this.sweetRepository = sweetRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public Sweet addSweet(Sweet sweet){
        return sweetRepository.save(sweet);
    }

    public List<Sweet> getAllSweets(){
        return sweetRepository.findAll();
    }

    public Optional<Sweet> getSweetById(String id){
        return sweetRepository.findById(id);
    }

    public Sweet updateSweet(String id, Sweet updatedSweet, MultipartFile photo, MultipartFile video) {
        return sweetRepository.findById(id).map(sweet -> {
            sweet.setName(updatedSweet.getName());
            sweet.setCategory(updatedSweet.getCategory());
            sweet.setPrice(updatedSweet.getPrice());
            sweet.setQuantity(updatedSweet.getQuantity());

            // ✅ Handle file uploads safely
            try {
                if (photo != null && !photo.isEmpty()) {
                    sweet.setPhoto(new Binary(photo.getBytes()));
                }
                if (video != null && !video.isEmpty()) {
                    sweet.setVideo(new Binary(video.getBytes()));
                }
            } catch (IOException e) {
                throw new RuntimeException("Error processing file upload: " + e.getMessage(), e);
            }

            return sweetRepository.save(sweet);
        }).orElseThrow(() -> new RuntimeException("Sweet Not found"));
    }

    public void deleteSweet(String id){
        sweetRepository.deleteById(id);
    }

    public List<Sweet> searchSweets(String name, String category, Double minPrice, Double maxPrice) {
        Query query = new Query();

        // Collect criteria in a list
        List<Criteria> criteriaList = new ArrayList<>();

        if (name != null && !name.isEmpty()) {
            criteriaList.add(Criteria.where("name").regex(name, "i")); // case-insensitive regex
        }
        if (category != null && !category.isEmpty()) {
            criteriaList.add(Criteria.where("category").regex(category, "i"));
        }
        if (minPrice != null && maxPrice != null) {
            criteriaList.add(Criteria.where("price").gte(minPrice).lte(maxPrice));
        } else if (minPrice != null) {
            criteriaList.add(Criteria.where("price").gte(minPrice));
        } else if (maxPrice != null) {
            criteriaList.add(Criteria.where("price").lte(maxPrice));
        }

        // Combine with AND
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        return mongoTemplate.find(query, Sweet.class);
    }

    public Sweet purchaseSweet(String id){
        return sweetRepository.findById(id).map(sweet -> {
            if (sweet.getQuantity() <= 0){
                throw new RuntimeException("Out of Stock!");
            }
            sweet.setQuantity(sweet.getQuantity() -1);
            return sweetRepository.save(sweet);
        }).orElseThrow(() -> new RuntimeException("Sweet Not Found"));
    }

    public Sweet restockSweet(String id, int amount){
        return sweetRepository.findById(id).map(sweet -> {
            sweet.setQuantity(sweet.getQuantity() + amount);
            return sweetRepository.save(sweet);
        }).orElseThrow(() -> new RuntimeException("Sweet Not Found"));
    }
}
