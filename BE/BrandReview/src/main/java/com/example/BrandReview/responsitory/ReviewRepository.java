package com.example.BrandReview.responsitory;

import com.example.BrandReview.model.Review;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends CrudRepository<Review, Integer> {
    public boolean existsByUserId(int userId);
    boolean existsByUserIdAndBrandId(int userId, int brandId);
    public List<Review> findAll();
}
