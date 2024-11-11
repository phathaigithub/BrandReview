package com.example.BrandReview.service;

import com.example.BrandReview.exception.AppException;
import com.example.BrandReview.exception.ErrorCode;
import com.example.BrandReview.model.Employee;
import com.example.BrandReview.model.Position;
import com.example.BrandReview.responsitory.EmployeeRepository;
import com.example.BrandReview.responsitory.PositionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImp implements EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PositionRepository positionRepository; // Add PositionRepository

    @Autowired
    private final PasswordEncoder passwordEncoder;

    public EmployeeServiceImp(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Employee saveEmployee(Employee employee) {
        // Fetch the "employee" position with ID 1
        Position defaultPosition = positionRepository.findById(3)
                .orElseThrow(() -> new AppException(ErrorCode.POSITION_NOT_FOUND)); // Ensure the default position exists

        employee.setPosition(defaultPosition);
        // Encrypt the password before saving
        employee.setPassword(passwordEncoder.encode(employee.getPassword()));

        // Save the employee
        return employeeRepository.save(employee);
    }

    @Override
    public List<Employee> getAllEmployees() {
        return (List<Employee>) employeeRepository.findAll();
    }
}
