package com.example.BrandReview.service;

import com.example.BrandReview.model.Employee;
import com.example.BrandReview.responsitory.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImp implements EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    public EmployeeServiceImp(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    @Override
    public Employee saveEmployee(Employee employee) {
        return null;
    }
}
