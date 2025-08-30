    package com.ocp.ecommerce.controller;

    import com.ocp.ecommerce.dto.CartRequest;
    import com.ocp.ecommerce.service.ICartService;
    import lombok.RequiredArgsConstructor;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.security.core.Authentication;
    import org.springframework.web.bind.annotation.*;


    @RestController
    @RequestMapping("/cart")
    @RequiredArgsConstructor
    public class CartController {

        private final ICartService cartService;
        @PostMapping("/add")
        public ResponseEntity<String> addToCart(@RequestBody CartRequest request, Authentication auth) {
            String userId = auth.getName();
            cartService.addToCart(userId, request); // ✅ appel réel
            return ResponseEntity.ok("Produit ajouté au panier !");
        }

        @PostMapping("/update")
        public ResponseEntity<String> updateQuantity(@RequestBody CartRequest request, Authentication auth) {
            String userId = auth.getName();
            cartService.updateCartItem(userId, request); // ✅ appel réel
            return ResponseEntity.ok("Quantité mise à jour !");
        }

        @PostMapping("/remove")
        public ResponseEntity<String> removeFromCart(@RequestBody CartRequest request, Authentication auth) {
            String userId = auth.getName();
            cartService.removeFromCart(userId, request); // ✅ appel réel
            return ResponseEntity.ok("Produit retiré du panier !");
        }

        @GetMapping("/{userId}/items")
        public ResponseEntity<?> getCartItems(@PathVariable String userId, Authentication auth) {
            // Vérifier que l'utilisateur connecté correspond bien à l'userId
            if (!auth.getName().equals(userId)) {
                return ResponseEntity.status(403).body("Accès refusé");
            }

            return ResponseEntity.ok(cartService.getCartItems(userId));
        }
        @GetMapping("/me/items")
        @PreAuthorize("hasRole('EMPLOYE')")
        public ResponseEntity<?> getOwnCartItems(Authentication auth) {
            String userId = auth.getName();
            return ResponseEntity.ok(cartService.getCartItems(userId));
        }

    }
