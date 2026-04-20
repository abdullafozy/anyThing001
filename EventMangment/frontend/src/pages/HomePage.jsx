import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Pagination,
} from "react-bootstrap";
import { FiSearch, FiX } from "react-icons/fi";

import EventCard from "../components/EventCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";
import { getEvents } from "../services/eventService.js";

const LIMIT = 6;

function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // search state — two separate values so the fetch only fires on submit
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);
      try {
        const params = { page, limit: LIMIT };
        if (search) params.search = search;

        const data = await getEvents(params);
        setEvents(data.events || []);
        setTotalPages(data.pages || 1);
        setTotal(data.total || 0);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [page, search]);

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleClear() {
    setSearchInput("");
    setSearch("");
    setPage(1);
  }

  return (
    <Container className="py-4">
      {/* header row */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <h1 className="page-title mb-0">Upcoming Events</h1>
        {!loading && !error && (
          <span className="text-muted" style={{ fontSize: "0.85rem" }}>
            {total} event{total !== 1 ? "s" : ""} found
          </span>
        )}
      </div>

      {/* search bar */}
      <Form onSubmit={handleSearch} className="mb-4" style={{ maxWidth: 440 }}>
        <InputGroup>
          <Form.Control
            placeholder="Search by title or location..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {search && (
            <Button variant="outline-secondary" type="button" onClick={handleClear}>
              <FiX size={14} />
            </Button>
          )}
          <Button type="submit" variant="primary">
            <FiSearch size={14} />
          </Button>
        </InputGroup>
      </Form>

      {search && (
        <p className="text-muted mb-3" style={{ fontSize: "0.87rem" }}>
          Showing results for: <strong>"{search}"</strong>
        </p>
      )}

      {/* loading */}
      {loading && <LoadingSpinner text="Fetching events..." />}

      {/* error */}
      {!loading && error && <ErrorAlert error={error} />}

      {/* empty state */}
      {!loading && !error && events.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">
            {search ? "No events match your search." : "No events available yet."}
          </p>
          {search && (
            <Button variant="outline-secondary" size="sm" onClick={handleClear}>
              Clear search
            </Button>
          )}
        </div>
      )}

      {/* events grid */}
      {!loading && !error && events.length > 0 && (
        <>
          <Row xs={1} sm={2} lg={3} className="g-3 mb-4">
            {events.map((event) => (
              <Col key={event._id}>
                <EventCard event={event} />
              </Col>
            ))}
          </Row>

          {/* pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-2">
              <Pagination size="sm">
                <Pagination.Prev
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Pagination.Item
                    key={p}
                    active={p === page}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
}

export default HomePage;
