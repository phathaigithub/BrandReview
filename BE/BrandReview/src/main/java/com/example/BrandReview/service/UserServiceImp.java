package com.example.BrandReview.service;

import com.example.BrandReview.model.User;
import com.example.BrandReview.responsitory.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserServiceImp implements UserService {
    @Autowired
    private UserRepository userRepository;


    @Override
    public User saveUser(User user) {
         if (userRepository.existsByUsername(user.getUsername())){
             throw new RuntimeException("Username already exists");
        } else if (userRepository.existsByEmail(user.getEmail())) {
             throw new RuntimeException("Email already exists");
         }
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return (List<User>) userRepository.findAll();
    }

    @Override
    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    @Override
    public User getUserById(int id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
