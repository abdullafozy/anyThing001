import React from "react";
import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";
import styled from "styled-components";

const StyledCard = styled(Card)`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s, transform 0.2s;
  height: 100%;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: #64748b;
  margin-bottom: 5px;
`;

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function EventCard({ event }) {
  const spotsLeft = event.capacity - event.registeredCount;
  const isFull = spotsLeft <= 0;

  return (
    <StyledCard>
      <Card.Body className="d-flex flex-column p-3">
        {/* category badge */}
        <div className="mb-2">
          <Badge
            bg="primary"
            style={{ fontSize: "0.7rem", fontWeight: 500, opacity: 0.85 }}
          >
            {event.category?.name || "Uncategorized"}
          </Badge>
          {isFull && (
            <Badge bg="danger" className="ms-1" style={{ fontSize: "0.7rem" }}>
              Full
            </Badge>
          )}
        </div>

        {/* title */}
        <Card.Title
          style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem" }}
        >
          {event.title}
        </Card.Title>

        {/* meta info */}
        <MetaRow>
          <FiCalendar size={13} />
          <span>{formatDate(event.date)}</span>
        </MetaRow>
        <MetaRow>
          <FiMapPin size={13} />
          <span>{event.location}</span>
        </MetaRow>
        <MetaRow>
          <FiUsers size={13} />
          <span>
            {event.registeredCount} / {event.capacity} registered
          </span>
        </MetaRow>

        {/* spacer + link */}
        <div className="mt-auto pt-3">
          <Link
            to={`/events/${event._id}`}
            className="btn btn-outline-primary btn-sm w-100"
          >
            View Details
          </Link>
        </div>
      </Card.Body>
    </StyledCard>
  );
}

export default EventCard;
