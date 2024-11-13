package com.example.BrandReview.service;

import com.example.BrandReview.model.User;
import org.apache.poi.ss.formula.functions.T;

import java.util.List;
import java.util.Optional;

public interface UserService{
    public User saveUser(User user);
    public List<User> getAllUsers();

    void deleteUser(int userid);

    public User updateUser(int id, User user);
    public Optional<T> getUserById(int id);
}
