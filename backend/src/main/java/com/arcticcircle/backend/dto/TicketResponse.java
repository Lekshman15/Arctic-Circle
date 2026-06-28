package com.arcticcircle.backend.dto;

import com.arcticcircle.backend.model.Ticket;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {
    private UUID ticketId;
    private String customerName;
    private String customerPhone;
    private String customerAddress;
    private Ticket.ApplianceType appliance;
    private String complaint;
    private String address;
    private String preferredTimings;
    private Ticket.TicketStatus status;
    private LocalDateTime createdAt;
}