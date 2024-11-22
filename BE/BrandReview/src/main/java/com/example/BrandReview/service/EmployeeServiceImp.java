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
        // Chỉ set position mặc định nếu không có position được truyền vào
        if (employee.getPosition() == null) {
            Position defaultPosition = positionRepository.findById(3)
                    .orElseThrow(() -> new AppException(ErrorCode.POSITION_NOT_FOUND));
            employee.setPosition(defaultPosition);
        } else {
            // Nếu có position, kiểm tra position có tồn tại trong DB không
            Position position = positionRepository.findById(employee.getPosition().getId())
                    .orElseThrow(() -> new AppException(ErrorCode.POSITION_NOT_FOUND));
            employee.setPosition(position);
        }

        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        
        if (employeeRepository.existsByUsername(employee.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        
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

        // Only update password if a new one is provided
        if (updatedEmployee.getPassword() != null && !updatedEmployee.getPassword().isEmpty()) {
            existingEmployee.setPassword(passwordEncoder.encode(updatedEmployee.getPassword()));
        }

        // Update position if needed
        if (updatedEmployee.getPosition() != null) {
            Position position = positionRepository.findById(updatedEmployee.getPosition().getId())
                    .orElseThrow(() -> new AppException(ErrorCode.POSITION_NOT_FOUND));
            existingEmployee.setPosition(position);
        }

        return employeeRepository.save(existingEmployee);
    }

    @Override
    public Employee updateEmployeeByUsername(String username, Employee updatedEmployee) {
        Employee existingEmployee = employeeRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));

        // Only update fields that should be editable
        if (updatedEmployee.getName() != null) {
            existingEmployee.setName(updatedEmployee.getName());
        }
        if (updatedEmployee.getPhone() != null) {
            existingEmployee.setPhone(updatedEmployee.getPhone());
        }
        if (updatedEmployee.getEmail() != null) {
            existingEmployee.setEmail(updatedEmployee.getEmail());
        }
        if (updatedEmployee.getGender() != null) {
            existingEmployee.setGender(updatedEmployee.getGender());
        }
        if (updatedEmployee.getBirth() != null) {
            existingEmployee.setBirth(updatedEmployee.getBirth());
        }

        return employeeRepository.save(existingEmployee);
    }

    @Override
    public Optional<Employee> getEmployeeByUsername(String username) {
        return employeeRepository.findByUsername(username);
    }

}
