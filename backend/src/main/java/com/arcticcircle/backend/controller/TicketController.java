package com.arcticcircle.backend.controller;

import com.arcticcircle.backend.dto.TicketRequest;
import com.arcticcircle.backend.dto.TicketResponse;
import com.arcticcircle.backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    // Customer raises a ticket
    @PostMapping
    public ResponseEntity<?> raiseTicket(
            @RequestBody TicketRequest request,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            TicketResponse response = ticketService.raiseTicket(request, userEmail);
            return ResponseEntity.status(201).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Customer views their own tickets
    @GetMapping("/my")
    public ResponseEntity<?> getMyTickets(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<TicketResponse> tickets = ticketService.getMyTickets(userEmail);
            return ResponseEntity.ok(tickets);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Admin views all tickets
    @GetMapping
    public ResponseEntity<?> getAllTickets() {
        try {
            List<TicketResponse> tickets = ticketService.getAllTickets();
            return ResponseEntity.ok(tickets);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Admin marks ticket as completed
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeTicket(@PathVariable UUID id) {
        try {
            TicketResponse response = ticketService.completeTicket(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}