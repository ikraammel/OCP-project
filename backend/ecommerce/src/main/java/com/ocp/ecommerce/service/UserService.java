package com.ocp.ecommerce.service;

import com.ocp.ecommerce.dto.UserDto;
import com.ocp.ecommerce.model.Role;
import com.ocp.ecommerce.model.User;
import com.ocp.ecommerce.repository.RoleRepository;
import com.ocp.ecommerce.repository.UserRepository;
import com.ocp.ecommerce.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Override
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }


    @Override
    public User createUser(UserDto dto, String roleName) {
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        user.getRoles().add(role);

        return userRepository.save(user);
    }

    @Override
    public User saveUserInfo(String email, UserDto userDto, String uid) {
        User user = new User();
        user.setEmail(email);
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());

        // ✅ Générer un mot de passe aléatoire si userDto.getPassword() est null (OAuth2)
        String rawPassword = userDto.getPassword() != null ? userDto.getPassword() : java.util.UUID.randomUUID().toString();
        user.setPassword(passwordEncoder.encode(rawPassword));

        user.setUid(uid); // IMPORTANT: on sauvegarde le uid Firebase ici

        Role role = roleRepository.findByName("ROLE_ASSOCIATION")
                .orElseThrow(() -> new RuntimeException("Role not found"));
        user.getRoles().add(role);

        return userRepository.save(user);
    }


    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(this::convertToDto).toList();
    }

    @Override
    public UserDto convertToDto(User user){
        UserDto userDto = new UserDto();
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setEmail(user.getEmail());
        return userDto;
    }
    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User findByUid(String uid) {
        System.out.println("Recherche utilisateur par uid: " + uid);
        User user = userRepository.findByUid(uid).orElse(null);
        System.out.println("Utilisateur trouvé: " + (user != null));
        return user;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = findByEmail(email);
        if (user == null) throw new UsernameNotFoundException("Utilisateur introuvable: " + email);
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword() != null ? user.getPassword() : "",
                user.getRoles().stream()
                        .map(r -> new SimpleGrantedAuthority(r.getName()))
                        .collect(Collectors.toList())
        );
    }

}
