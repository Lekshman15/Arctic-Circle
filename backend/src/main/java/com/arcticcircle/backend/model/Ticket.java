package com.arcticcircle.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ticket_id")
    private UUID ticketId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplianceType appliance;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String complaint;

    @Column(nullable = false)
    private String address;

    @Column(name = "preferred_timings")
    private String preferredTimings;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = TicketStatus.Open;
    }

    public enum ApplianceType {
        AC, WashingMachine, Fridge
    }

    public enum TicketStatus {
        Open, Completed
    }
}