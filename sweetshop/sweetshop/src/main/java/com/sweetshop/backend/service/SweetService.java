package com.sweetshop.backend.service;


import com.sweetshop.backend.model.Sweet;
import com.sweetshop.backend.repository.SweetRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

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

    public Sweet updateSweet(String id, Sweet updatedSweet) {
        return  sweetRepository.findById(id).map(sweet -> {
            sweet.setName(updatedSweet.getName());
            sweet.setCategory(updatedSweet.getCategory());
            sweet.setPrice(updatedSweet.getPrice());
            sweet.setQuantity(updatedSweet.getQuantity());
            sweet.setPhoto(updatedSweet.getPhoto());
            sweet.setVideo(updatedSweet.getVideo());
            return sweetRepository.save(sweet);
        }).orElseThrow(() -> new RuntimeException("Sweet Not found"));
    }

    public void deleteSweet(String id){
        sweetRepository.deleteById(id);
    }

    public List<Sweet> searchSweets(String name, String category, Double minPrice, Double maxPrice) {
        Query query = new Query();

        if (name!= null && !name.isEmpty()) {
            query.addCriteria(Criteria.where("name").regex(name, "i"));
        } else if(category!=null && !category.isEmpty()){
            query.addCriteria(Criteria.where("category").regex(category, "i"));
        } else if (minPrice != null && maxPrice != null) {
            query.addCriteria(Criteria.where("price").gte(minPrice).lte(maxPrice));
        } else if (minPrice != null) {
            query.addCriteria(Criteria.where("price").gte(minPrice));
        } else if (maxPrice != null) {
            query.addCriteria(Criteria.where("price").lte(maxPrice));
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
