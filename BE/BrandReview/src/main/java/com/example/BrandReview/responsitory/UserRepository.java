package com.example.BrandReview.responsitory;

import com.example.BrandReview.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

}
