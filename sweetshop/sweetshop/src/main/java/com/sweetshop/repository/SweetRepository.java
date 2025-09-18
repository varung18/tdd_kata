package com.sweetshop.repository;

import com.sweetshop.model.Sweet;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SweetRepository extends MongoRepository<Sweet, String> {
    List<Sweet> findByNameContainingIgnoreCase(String name);
    List<Sweet> findByCategoryIgnoreCase(String category);
    List<Sweet> findByPriceBetween(double min, double max);
}
