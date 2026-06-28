package com.arcticcircle.backend.repository;

import com.arcticcircle.backend.model.Order;
import com.arcticcircle.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByUser(User user);
    List<Order> findByStatus(Order.OrderStatus status);
    List<Order> findAllByOrderByCreatedAtDesc();
}