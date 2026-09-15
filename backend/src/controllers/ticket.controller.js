const prisma = require("../lib/prisma");

function toTicketSummary(ticket) {
  return {
    id: ticket.id,
    appliance: ticket.appliance,
    complaint: ticket.complaint,
    address: ticket.address,
    preferredTimings: ticket.preferredTimings,
    status: ticket.status,
    rating: ticket.rating,
    feedback: ticket.feedback,
    createdAt: ticket.createdAt,
    completedAt: ticket.completedAt,
    customer: { name: ticket.user.name, phone: ticket.user.phone },
  };
}

async function raiseTicket(req, res) {
  const { appliance, complaint, address, preferredTimings } = req.body;

  if (!appliance || !address || !preferredTimings) {
    return res.status(400).json({
      error: "appliance, address and preferredTimings are required.",
    });
  }

  const normalizedAppliance = String(appliance).toUpperCase();

  const allowedAppliances = [
    "AC",
    "STABILIZER",
    "WASHING_MACHINE",
    "FRIDGE",
  ];

  if (!allowedAppliances.includes(normalizedAppliance)) {
    return res.status(400).json({
      error: "Invalid appliance type.",
    });
  }

  const ticket = await prisma.ticket.create({
    data: {
      userId: req.user.id,
      appliance: normalizedAppliance,
      complaint: complaint || "",
      address,
      preferredTimings,
    },
    include: { user: true },
  });

  res.status(201).json(toTicketSummary(ticket));
}

async function getMyTickets(req, res) {
  const tickets = await prisma.ticket.findMany({
    where: { userId: req.user.id },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(tickets.map(toTicketSummary));
}

async function getAllTickets(req, res) {
  const tickets = await prisma.ticket.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(tickets.map(toTicketSummary));
}

// Admin marks a ticket resolved
async function completeTicket(req, res) {
  const existing = await prisma.ticket.findUnique({
    where: { id: req.params.id },
  });

  if (!existing) {
    return res.status(404).json({
      error: "Ticket not found.",
    });
  }

  const ticket = await prisma.ticket.update({
    where: { id: req.params.id },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
    },
    include: { user: true },
  });

  res.json(toTicketSummary(ticket));
}

// Customer leaves feedback + star rating once their own ticket is closed
async function submitFeedback(req, res) {
  const { rating, feedback } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      error: "rating must be between 1 and 5.",
    });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: req.params.id },
  });

  if (!ticket) {
    return res.status(404).json({
      error: "Ticket not found.",
    });
  }

  if (ticket.userId !== req.user.id) {
    return res.status(403).json({
      error: "This isn't your ticket.",
    });
  }

  if (ticket.status !== "COMPLETED") {
    return res.status(400).json({
      error: "Feedback can only be left once the ticket is closed.",
    });
  }

  // Prevent the user from submitting feedback more than once
  if (ticket.rating !== null) {
    return res.status(400).json({
      error: "Feedback has already been submitted for this ticket.",
    });
  }

  const updated = await prisma.ticket.update({
    where: { id: req.params.id },
    data: {
      rating,
      feedback,
    },
    include: {
      user: true,
    },
  });

  res.json(toTicketSummary(updated));
}

module.exports = { raiseTicket, getMyTickets, getAllTickets, completeTicket, submitFeedback };
