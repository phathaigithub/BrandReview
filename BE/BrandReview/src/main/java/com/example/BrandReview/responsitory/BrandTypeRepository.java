package com.example.BrandReview.responsitory;
import com.example.BrandReview.model.BrandType;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandTypeRepository extends CrudRepository<BrandType, Integer> {


}
