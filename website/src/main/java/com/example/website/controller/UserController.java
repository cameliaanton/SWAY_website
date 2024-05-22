package com.example.website.controller;

import com.example.website.dto.ChangePasswordRequest;
import com.example.website.dto.CustomerDTO;
import com.example.website.dto.Login;
import com.example.website.dto.RegisterClient;
import com.example.website.entity.Customer;
import com.example.website.entity.User;
import com.example.website.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin()
@AllArgsConstructor
public class UserController {
    private final UserService userService;
    @GetMapping("/getUsers")
    public List<User> getUsers(){
        return userService.getUsers();
    }
    @GetMapping("/getUser")
    public ResponseEntity<Optional<User>> getUser(@RequestParam String email) {
        Optional<User> user = userService.getUser(email);
        return user.isPresent() ? new ResponseEntity<>(user, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login login){
        try{
            User user= userService.login(login);
            return  new ResponseEntity<>(user,HttpStatus.OK);
        }catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PutMapping("/updateUser") // Changed from @PostMapping to @PutMapping for updating data
    public ResponseEntity<?> updateUser(@RequestParam Long id, @RequestBody CustomerDTO customerDTO) {
        try {
            Optional<User> userUpdated = userService.updateCustomer(id, customerDTO);
            return userUpdated.isPresent() ? new ResponseEntity<>(userUpdated, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody  RegisterClient registerClient){
        try{
            Long id= userService.register(registerClient);
            
            return  new ResponseEntity<>(id,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/registerAdmin")
    public ResponseEntity<?> registerAdmin(@RequestBody RegisterClient registerAdmin){
        try{
            Long id= userService.registerAdmin(registerAdmin);
            return  new ResponseEntity<>(id,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/registerEmployee")
    public ResponseEntity<?> registerEmployee(@RequestBody  RegisterClient registerClient){
        try{
            Long id= userService.registerEmployee(registerClient);
            return  new ResponseEntity<>(id,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PutMapping("/login/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        try {
            Optional<User> user = userService.changePassword(changePasswordRequest.getEmail(), changePasswordRequest.getPassword(), changePasswordRequest.getRepeatPassword());
            if (user.isPresent()) {
                return new ResponseEntity<>(user.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
