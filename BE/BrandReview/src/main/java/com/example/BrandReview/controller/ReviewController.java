package com.example.BrandReview.controller;
import com.example.BrandReview.dto.response.ApiResponse;
import com.example.BrandReview.exception.AppException;
import com.example.BrandReview.exception.ErrorCode;
import com.example.BrandReview.model.Brand;
import com.example.BrandReview.model.Review;
import com.example.BrandReview.model.ReviewImage;
import com.example.BrandReview.model.User;
import com.example.BrandReview.responsitory.BrandRepository;
import com.example.BrandReview.responsitory.ReviewRepository;
import com.example.BrandReview.responsitory.UserRepository;
import com.example.BrandReview.service.ReviewService;
import com.example.BrandReview.dto.ReviewDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/review")
@CrossOrigin

public class ReviewController {
    @Autowired
    private ReviewService reviewService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private ReviewRepository reviewRepository;

    @PostMapping("/add")
    public ApiResponse<Review> createReview(@Valid
            @RequestParam("userID") int userID,
            @RequestParam("brandID") int brandID,
            @RequestParam("content") String content,
            @RequestParam("quality") double quality,
            @RequestParam("price") double price,
            @RequestParam("service") double service,
            @RequestParam("location") double location,
            @RequestParam("space") double space,
            @RequestParam(value = "images", required = false) List<MultipartFile> images
    ) {
        try{
        if (reviewRepository.existsByUserIdAndBrandId(userID, brandID))
            throw new AppException(ErrorCode.ALREADY_REVIEW);
        User user = userRepository.findById(userID)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Brand brand = brandRepository.findById(brandID)
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        // Create a new review
        Review review = new Review();
        review.setContent(content);
        review.setQualityScore(quality);
        review.setPriceScore(price);
        review.setStatus(0);
        review.setServiceScore(service);
        review.setLocationScore(location);
        review.setSpaceScore(space);
        review.setInitDate(LocalDateTime.now());
        review.setBrand(brand);
        review.setUser(user);
        review.setImages(new ArrayList<ReviewImage>());
        if (images != null)
            for (MultipartFile image : images) {
                // Save image to file system or database and create ReviewImage object
                String imagePath = saveImage(image);
                ReviewImage reviewImage = new ReviewImage();
                reviewImage.setPath(imagePath);
                reviewImage.setReview(review);
                review.getImages().add(reviewImage);
            }

        // Save the review to the database
        reviewService.saveReview(review);
        ApiResponse<Review> response = new ApiResponse<>();
        response.setCode(200); // HTTP 200 OK
        response.setResult(review);
        return response;
        }catch (AppException e) {
            throw new AppException(ErrorCode.ALREADY_REVIEW);
        } catch (Exception e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    private String saveImage(MultipartFile image) {
        try {
            String uniqueName = UUID.randomUUID().toString() + "_" + System.currentTimeMillis();
            String originalFilename = image.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String imagePath = uniqueName + extension;
            Path filePath = Paths.get("src/main/resources/static/uploads/" + imagePath);
            Files.createDirectories(filePath.getParent()); // Ensure parent directories exist
            Files.write(filePath, image.getBytes());

            return imagePath; // Return the path for storage in the database
        } catch (IOException e) {
            e.printStackTrace(); // Log the error (or replace with a proper logging framework)
            throw new RuntimeException("Failed to save image: " + e.getMessage(), e);
        }
    }

    @PutMapping("/report/{id}")
    public ApiResponse<Review> reportReview(@PathVariable Integer id) {
        try {
            Review review = reviewRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Review not found"));
            // Only change status to reported if it's not already marked as valid
            if (review.getStatus() != 2) {
                review.setStatus(1);
                reviewRepository.save(review);
            }
            
            ApiResponse<Review> response = new ApiResponse<>();
            response.setCode(200);
            response.setResult(review);
            return response;
        } catch (Exception e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    @PutMapping("/markValid/{id}")
    public ApiResponse<Review> markValidReview(@PathVariable Integer id) {
        try {
            Review review = reviewRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Review not found"));
            review.setStatus(2); // Set status to 2 for "valid"
            reviewRepository.save(review);
            
            ApiResponse<Review> response = new ApiResponse<>();
            response.setCode(200);
            response.setResult(review);
            return response;
        } catch (Exception e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    @GetMapping("/getAllReviews")
    public List<ReviewDTO> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        return reviews.stream()
            .map(review -> new ReviewDTO(
                review.getId(),
                review.getUser().getName(),
                review.getBrand().getName(),
                review.getContent(),
                review.getInitDate(),
                review.getStatus(),
                review.getBrand().getId(),
                review.getImages()
            ))
            .collect(Collectors.toList());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Integer id) {
        try {
            Review review = reviewRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Review not found"));
            reviewRepository.delete(review);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
