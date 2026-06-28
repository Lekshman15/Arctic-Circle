package com.arcticcircle.backend.repository;

import com.arcticcircle.backend.model.Ticket;
import com.arcticcircle.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, UUID> {
    List<Ticket> findByUser(User user);
    List<Ticket> findByStatus(Ticket.TicketStatus status);
    List<Ticket> findAllByOrderByCreatedAtDesc();
}