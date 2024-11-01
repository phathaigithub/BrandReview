package com.example.BrandReview.service;

import com.example.BrandReview.model.User;

import java.util.List;

public interface UserService{
    public User saveUser(User user);
    public List<User> getAllUsers();
}
