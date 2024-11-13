package com.example.BrandReview.service;

import com.example.BrandReview.responsitory.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ReviewServiceImp implements ReviewService {
    @Autowired
    private ReviewRepository ReviewRepository;



}
