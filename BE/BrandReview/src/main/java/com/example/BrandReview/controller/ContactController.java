package com.example.BrandReview.controller;

import com.example.BrandReview.dto.response.ApiResponse;
import com.example.BrandReview.model.Contact;
import com.example.BrandReview.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/contact")
@CrossOrigin
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping("/add")
    public ApiResponse<Contact> add(@RequestBody @Valid Contact contact) {
        ApiResponse<Contact> response = new ApiResponse<>();
        response.setResult(contactService.saveContact(contact)); // Trả về json trạng thái của request
        return response;
    }

    @GetMapping("/getAll")
    public List<Contact> getAll() {
        return contactService.getAllContact();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> delete(@PathVariable("id") int contactId) {
        ApiResponse<String> response = new ApiResponse<>();

        contactService.deleteContact(contactId);
        response.setResult("Contact deleted successfully");

        return response;
    }

    @PutMapping("/edit/{id}")
    public ApiResponse<Contact> edit(@PathVariable("id") int contactId, @RequestBody @Valid Contact updatedContact) {
        ApiResponse<Contact> response = new ApiResponse<>();

        Contact updated = contactService.updateContactState(contactId, updatedContact);
        response.setResult(updated);

        return response;
    }

}
