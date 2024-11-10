package com.example.BrandReview.responsitory;

import com.example.BrandReview.model.Employee;
import com.example.BrandReview.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends CrudRepository<User, Integer> {
//    boolean existsByEmployeename(String username);
//    boolean existsByEmail(String email);
//    Optional<Employee> findByEmployeename(String username);
}
