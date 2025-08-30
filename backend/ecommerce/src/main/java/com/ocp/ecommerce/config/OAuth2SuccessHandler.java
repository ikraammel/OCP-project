package com.ocp.ecommerce.config;

import com.ocp.ecommerce.dto.UserDto;
import com.ocp.ecommerce.model.User;
import com.ocp.ecommerce.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired private JwtUtils jwtUtils;
    @Autowired private IUserService userService;

    public OAuth2SuccessHandler(IUserService userService, JwtUtils jwtUtils) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name  = oauthUser.getAttribute("name"); // si dispo

        // 1) Upsert utilisateur
        User user = userService.findByEmail(email);
        if (user == null) {
            UserDto dto = new UserDto();
            dto.setEmail(email);
            dto.setFirstName(name != null ? name : ""); // gérer null
            dto.setLastName(""); // si Google ne fournit pas le nom de famille
            dto.setPassword(null); // mot de passe null pour OAuth2

            user = userService.saveUserInfo(email, dto, java.util.UUID.randomUUID().toString());
        }

        // 2) Générer JWT
        String token = jwtUtils.generateJwtToken(email);

        // 3) Rediriger vers le front avec le token
        getRedirectStrategy().sendRedirect(request, response,
                "http://localhost:5173/oauth2/callback?token=" + token);
    }

}
