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
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
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
        if (reviewRepository.existsByUserId(userID))
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
}
