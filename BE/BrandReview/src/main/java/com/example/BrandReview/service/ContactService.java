package com.example.BrandReview.service;

import com.example.BrandReview.model.Contact;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ContactService {
    public Contact saveContact(Contact contact);
    public List<Contact> getAllContact();
    public Contact getContactById(int id);
    public Contact updateContactState(int id, Contact contact);
    public void deleteContact(int id);
}
