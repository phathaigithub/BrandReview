package com.example.BrandReview.service;

import com.example.BrandReview.model.Brand;
import com.example.BrandReview.model.Review;
import com.example.BrandReview.responsitory.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ReviewServiceImp implements ReviewService {
    @Autowired
    private ReviewRepository ReviewRepository;
    @Override
    public Review saveReview(Review review) {
        return ReviewRepository.save(review);
    }


}
