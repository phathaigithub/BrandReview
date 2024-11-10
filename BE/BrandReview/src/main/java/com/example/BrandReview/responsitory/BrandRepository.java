package com.example.BrandReview.responsitory;

import com.example.BrandReview.model.Brand;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends CrudRepository<Brand, Integer> {
    Brand findBrandBySlugIgnoreCase(String slug);

}
