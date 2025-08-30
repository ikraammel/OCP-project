package com.ocp.ecommerce.service;

import com.ocp.ecommerce.dto.UserDto;
import com.ocp.ecommerce.model.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

public interface IUserService extends UserDetailsService {
    User updateUser(User user);
    boolean existsByEmail(String email);
    User createUser(UserDto dto, String roleName);
    User saveUserInfo(String email, UserDto userDto, String uid);
    User findByEmail(String email);
    List<UserDto> getAllUsers();
    UserDto convertToDto(User user);
    User getUserById(Long id);
    User findByUid(String uid);
    UserDetails loadUserByUsername(String email) throws UsernameNotFoundException;
}
