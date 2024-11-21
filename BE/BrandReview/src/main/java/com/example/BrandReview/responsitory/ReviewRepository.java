package com.example.BrandReview.responsitory;

import com.example.BrandReview.model.Review;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends CrudRepository<Review, Integer> {
    public boolean existsByUserId(int userId);
}
