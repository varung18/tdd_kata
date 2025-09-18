package com.sweetshop.backend.repository;

import com.sweetshop.backend.model.Sweet;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SweetRepository extends MongoRepository<Sweet, String> {
    List<Sweet> findByNameContainingIgnoreCase(String name);
    List<Sweet> findByCategoryContainingIgnoreCase(String category);
    List<Sweet> findByPriceBetween(double min, double max);
    List<Sweet> findByPriceGreaterThanEqual(double minPrice);
    List<Sweet> findByPriceLessThanEqual(double maxPrice);
}
