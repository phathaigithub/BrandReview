package com.example.BrandReview.service;

import com.example.BrandReview.exception.AppException;
import com.example.BrandReview.exception.ErrorCode;
import com.example.BrandReview.model.Employee;
import com.example.BrandReview.model.Position;
import com.example.BrandReview.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.BrandReview.responsitory.UserRepository;
import org.apache.poi.ss.formula.functions.T;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        // Save the employee
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return (List<User>) userRepository.findAll();
    }

    @Override
    public void deleteUser(int userid) {
        userRepository.deleteById(userid);
    }

    @Override
    public Optional<T> getUserById(int id) {
        return Optional.empty();
    }

    @Override
    public User updateUser(int userid, User updateUser) {
        User existingUser = userRepository.findById(userid)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));

        existingUser.setName(updateUser.getName());
        existingUser.setPhone(updateUser.getPhone());
        existingUser.setEmail(updateUser.getEmail());
        existingUser.setGender(updateUser.getGender());
        existingUser.setBirth(updateUser.getBirth());

        return userRepository.save(existingUser);
    }
}
