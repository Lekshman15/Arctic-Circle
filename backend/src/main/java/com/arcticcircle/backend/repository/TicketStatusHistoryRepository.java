package com.arcticcircle.backend.repository;

import com.arcticcircle.backend.model.Ticket;
import com.arcticcircle.backend.model.TicketStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TicketStatusHistoryRepository extends JpaRepository<TicketStatusHistory, UUID> {
    List<TicketStatusHistory> findByTicketOrderByChangedAtAsc(Ticket ticket);
}