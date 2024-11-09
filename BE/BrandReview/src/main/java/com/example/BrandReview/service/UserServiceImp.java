package com.example.BrandReview.service;

import com.example.BrandReview.exception.AppException;
import com.example.BrandReview.exception.ErrorCode;
import com.example.BrandReview.model.User;
import com.example.BrandReview.responsitory.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.*;

@Service
public class UserServiceImp implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    public UserServiceImp(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public User saveUser(User user) {
         if (userRepository.existsByUsername(user.getUsername())){
             throw new AppException(ErrorCode.USER_EXISTED);
        } else if (userRepository.existsByEmail(user.getEmail())) {
             throw new AppException(ErrorCode.EMAIL_EXISTED);
         }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
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
