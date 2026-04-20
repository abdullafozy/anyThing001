import api from "./api.js";

export async function getEvents(params) {
  // params: { page, limit, search, category }
  const response = await api.get("/events", { params });
  return response.data;
}

export async function getEventById(id) {
  const response = await api.get(`/events/${id}`);
  return response.data;
}

export async function createEvent(data) {
  const response = await api.post("/events", data);
  return response.data;
}

export async function registerForEvent(eventId) {
  const response = await api.post("/registrations", { eventId });
  return response.data;
}

export async function cancelRegistration(registrationId) {
  const response = await api.delete(`/registrations/${registrationId}`);
  return response.data;
}

export async function getMyRegistrations() {
  const response = await api.get("/registrations/my");
  return response.data;
}
