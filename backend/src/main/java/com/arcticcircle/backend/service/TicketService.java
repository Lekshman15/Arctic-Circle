package com.arcticcircle.backend.service;

import com.arcticcircle.backend.dto.TicketRequest;
import com.arcticcircle.backend.dto.TicketResponse;
import com.arcticcircle.backend.model.Ticket;
import com.arcticcircle.backend.model.TicketStatusHistory;
import com.arcticcircle.backend.model.User;
import com.arcticcircle.backend.repository.TicketRepository;
import com.arcticcircle.backend.repository.TicketStatusHistoryRepository;
import com.arcticcircle.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketStatusHistoryRepository ticketStatusHistoryRepository;
    private final UserRepository userRepository;

    // Customer raises a ticket
    public TicketResponse raiseTicket(TicketRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ticket ticket = Ticket.builder()
                .user(user)
                .appliance(request.getAppliance())
                .complaint(request.getComplaint())
                .address(request.getAddress())
                .preferredTimings(request.getPreferredTimings())
                .status(Ticket.TicketStatus.Open)
                .build();

        Ticket saved = ticketRepository.save(ticket);

        // Log initial status in history
        TicketStatusHistory history = TicketStatusHistory.builder()
                .ticket(saved)
                .status(Ticket.TicketStatus.Open)
                .build();
        ticketStatusHistoryRepository.save(history);

        return mapToResponse(saved);
    }

    // Customer views their own tickets
    public List<TicketResponse> getMyTickets(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ticketRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Admin views all tickets
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Admin marks ticket as completed
    public TicketResponse completeTicket(UUID ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(Ticket.TicketStatus.Completed);
        Ticket saved = ticketRepository.save(ticket);

        // Log status change in history
        TicketStatusHistory history = TicketStatusHistory.builder()
                .ticket(saved)
                .status(Ticket.TicketStatus.Completed)
                .build();
        ticketStatusHistoryRepository.save(history);

        return mapToResponse(saved);
    }

    private TicketResponse mapToResponse(Ticket ticket) {
        return TicketResponse.builder()
                .ticketId(ticket.getTicketId())
                .customerName(ticket.getUser().getName())
                .customerPhone(ticket.getUser().getPhone())
                .customerAddress(ticket.getUser().getAddress())
                .appliance(ticket.getAppliance())
                .complaint(ticket.getComplaint())
                .address(ticket.getAddress())
                .preferredTimings(ticket.getPreferredTimings())
                .status(ticket.getStatus())
                .createdAt(ticket.getCreatedAt())
                .build();
    }
}