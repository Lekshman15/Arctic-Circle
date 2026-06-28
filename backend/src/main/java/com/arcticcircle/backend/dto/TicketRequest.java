package com.arcticcircle.backend.dto;

import com.arcticcircle.backend.model.Ticket;
import lombok.Data;

@Data
public class TicketRequest {
    private Ticket.ApplianceType appliance;
    private String complaint;
    private String address;
    private String preferredTimings;
}