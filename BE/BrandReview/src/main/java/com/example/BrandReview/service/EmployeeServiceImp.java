package com.example.BrandReview.service;

import com.example.BrandReview.exception.AppException;
import com.example.BrandReview.exception.ErrorCode;
import com.example.BrandReview.model.Employee;
import com.example.BrandReview.model.Position;
import com.example.BrandReview.model.User;
import com.example.BrandReview.responsitory.EmployeeRepository;
import com.example.BrandReview.responsitory.PositionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

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
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
//        LocalDate birthDate = LocalDate.parse(employee.getBirth().toString(), formatter);
//        employee.setBirth(birthDate);
        // Fetch the "employee" position with ID 1
        Position defaultPosition = positionRepository.findById(3)
                .orElseThrow(() -> new AppException(ErrorCode.POSITION_NOT_FOUND)); // Ensure the default position exists

        employee.setPosition(defaultPosition);
        employee.setPassword(passwordEncoder.encode(employee.getPassword()));

        // Save the employee
        return employeeRepository.save(employee);
    }

    @Override
    public List<Employee> getAllEmployees() {
        return (List<Employee>) employeeRepository.findAll();
    }

    @Override
    public void deleteEmployee(int empId) {
        employeeRepository.deleteById(empId);
    }

    @Override
    public Optional<Employee> getEmployeeById(int id) {
        return employeeRepository.findById(id);
    }

    @Override
    public Employee updateEmployee(int id, Employee updatedEmployee) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));

        existingEmployee.setUsername(updatedEmployee.getUsername());
        existingEmployee.setName(updatedEmployee.getName());
        existingEmployee.setPhone(updatedEmployee.getPhone());
        existingEmployee.setEmail(updatedEmployee.getEmail());
        existingEmployee.setGender(updatedEmployee.getGender());
        existingEmployee.setBirth(updatedEmployee.getBirth());

        // Update position if needed
        if (updatedEmployee.getPosition() != null) {
            Position position = positionRepository.findById(updatedEmployee.getPosition().getId())
                    .orElseThrow(() -> new AppException(ErrorCode.POSITION_NOT_FOUND));
            existingEmployee.setPosition(position);
        }

        return employeeRepository.save(existingEmployee);
    }



}
