package com.example.BrandReview.service;


import com.example.BrandReview.model.Employee;
import java.util.List;
import java.util.Optional;

public interface EmployeeService {
    public Employee saveEmployee(Employee employee);
    public List<Employee> getAllEmployees();
    public void deleteEmployee(int id);
    public Optional<Employee> getEmployeeById(int id);
    Employee updateEmployee(int id, Employee updatedEmployee);
    Optional<Employee> getEmployeeByUsername(String username);
    Employee updateEmployeeByUsername(String username, Employee updatedEmployee);
}
