package com.sweetshop.backend.controller;


import com.sweetshop.backend.model.Sweet;
import com.sweetshop.backend.service.SweetService;
import org.bson.types.Binary;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/sweets")
public class SweetController {

    private final SweetService sweetService;

    public SweetController(SweetService sweetService) {
        this.sweetService = sweetService;
    }

    @PostMapping
    public ResponseEntity<Sweet> addSweet(
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam double price,
            @RequestParam int quantity,
            @RequestParam(required = false) MultipartFile photo,
            @RequestParam(required = false) MultipartFile video
    ) throws IOException {
        Sweet sweet = new Sweet();
        sweet.setName(name);
        sweet.setCategory(category);
        sweet.setPrice(price);
        sweet.setQuantity(quantity);

        if (photo != null) {
            sweet.setPhoto(new Binary(photo.getBytes()));
        }

        if (video != null) {
            sweet.setVideo(new Binary(video.getBytes()));
        }

        return ResponseEntity.ok(sweetService.addSweet(sweet));
    }

    @GetMapping
    public ResponseEntity<List<Sweet>> getAllSweets() {
        return ResponseEntity.ok(sweetService.getAllSweets());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Sweet>> searchSweets(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ){
        return ResponseEntity.ok(sweetService.searchSweets(name, category, minPrice, maxPrice));
    }

    @GetMapping("/{id}/photo")
    public ResponseEntity<byte[]> getPhoto(@PathVariable String id) {
        Sweet sweet = sweetService.getSweetById(id)
                .orElseThrow(() -> new RuntimeException("Sweet not found"));
        if (sweet.getPhoto() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + sweet.getName() + "_photo\"")
                .contentType(MediaType.IMAGE_JPEG) // or MediaType.APPLICATION_OCTET_STREAM if unsure
                .body(sweet.getPhoto().getData());
    }

    @GetMapping("/{id}/video")
    public ResponseEntity<byte[]> getVideo(@PathVariable String id) {
        Sweet sweet = sweetService.getSweetById(id)
                .orElseThrow(() -> new RuntimeException("Sweet not found"));
        if (sweet.getVideo() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + sweet.getName() + "_video\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM) // video file
                .body(sweet.getVideo().getData());
    }


    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Sweet> updateSweet(
            @PathVariable String id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "price", required = false) Double price,
            @RequestParam(value = "quantity", required = false) Integer quantity,
            @RequestPart(value = "photo", required = false) MultipartFile photo,
            @RequestPart(value = "video", required = false) MultipartFile video
    ) {
        Sweet updatedSweet = new Sweet();
        updatedSweet.setName(name);
        updatedSweet.setCategory(category);
        updatedSweet.setPrice(price);
        updatedSweet.setQuantity(quantity);

        Sweet updated = sweetService.updateSweet(id, updatedSweet, photo, video);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSweet(@PathVariable String id){
        sweetService.deleteSweet(id);
        return ResponseEntity.ok("Sweet Deleted Successfully!");
    }

    @PostMapping("/{id}/purchase")
    public ResponseEntity<Sweet> purchaseSweet(@PathVariable String id){
        return ResponseEntity.ok(sweetService.purchaseSweet(id));
    }

    @PostMapping("/{id}/restock")
    public ResponseEntity<Sweet> restockSweet(@PathVariable String id, @RequestParam int amount){
        return ResponseEntity.ok(sweetService.restockSweet(id, amount));
    }
}
