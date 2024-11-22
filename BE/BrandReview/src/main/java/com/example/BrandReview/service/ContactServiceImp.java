package com.example.BrandReview.service;

import com.example.BrandReview.model.Contact;
import com.example.BrandReview.responsitory.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactServiceImp implements ContactService {

    @Autowired
    private ContactRepository contactRepository;
    @Override
    public Contact saveContact(Contact contact) {
        return contactRepository.save(contact);
    }

    @Override
    public List<Contact> getAllContact() {
        return (List<Contact>) contactRepository.findAll();
    }

    @Override
    public Contact getContactById(int id) {
        return null;
    }

    @Override
    public Contact updateContactState(int id, Contact contactUpdated) {
        Contact updatedContact = contactRepository.findById(id).get();
        updatedContact.setIsexcuted(contactUpdated.getIsexcuted());
        return contactRepository.save(updatedContact);
    }

    @Override
    public void deleteContact(int id) {
        contactRepository.deleteById(id);
    }
}
