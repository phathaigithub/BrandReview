package com.example.BrandReview.controller;
import com.example.BrandReview.model.Review;
import com.example.BrandReview.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/Review")
@CrossOrigin

public class ReviewController {
    @Autowired
    private ReviewService ReviewService;


}
