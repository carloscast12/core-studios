import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import { registerUser } from "./helpers.js";

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

describe("Bookings", () => {
  it("crea una reserva en un horario libre", async () => {
    const { token } = await registerUser();
    const start = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const end = new Date(start.getTime() + 1000 * 60 * 60 * 2);

    const res = await request(app)
      .post("/api/bookings")
      .set(authHeader(token))
      .send({ cabinType: "dj", startTime: start, endTime: end, price: 45 });

    expect(res.status).toBe(201);
    expect(res.body.cabinType).toBe("dj");
  });

  it("rechaza una reserva que se superpone con otra activa", async () => {
    const { token } = await registerUser();
    const start = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const end = new Date(start.getTime() + 1000 * 60 * 60 * 2);

    await request(app)
      .post("/api/bookings")
      .set(authHeader(token))
      .send({ cabinType: "dj", startTime: start, endTime: end, price: 45 });

    // se solapa 30 min con la anterior
    const overlappingStart = new Date(start.getTime() + 1000 * 60 * 60);
    const overlappingEnd = new Date(overlappingStart.getTime() + 1000 * 60 * 60);

    const res = await request(app)
      .post("/api/bookings")
      .set(authHeader(token))
      .send({ cabinType: "dj", startTime: overlappingStart, endTime: overlappingEnd, price: 45 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("horario no disponible");
  });

  it("permite reservar un horario que ya estaba ocupado, si esa reserva fue cancelada (regresión del bug real)", async () => {
    const { token } = await registerUser();
    const start = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const end = new Date(start.getTime() + 1000 * 60 * 60 * 2);

    const first = await request(app)
      .post("/api/bookings")
      .set(authHeader(token))
      .send({ cabinType: "dj", startTime: start, endTime: end, price: 45 });

    await request(app)
      .put(`/api/bookings/${first.body._id}`)
      .set(authHeader(token))
      .send({ status: "cancelada" });

    const second = await request(app)
      .post("/api/bookings")
      .set(authHeader(token))
      .send({ cabinType: "dj", startTime: start, endTime: end, price: 45 });

    expect(second.status).toBe(201);
  });

  it("permite reservar un horario distinto aunque haya otra reserva activa", async () => {
    const { token } = await registerUser();
    const start = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const end = new Date(start.getTime() + 1000 * 60 * 60 * 2);
    await request(app)
      .post("/api/bookings")
      .set(authHeader(token))
      .send({ cabinType: "dj", startTime: start, endTime: end, price: 45 });

    const laterStart = new Date(start.getTime() + 1000 * 60 * 60 * 5);
    const laterEnd = new Date(laterStart.getTime() + 1000 * 60 * 60);
    const res = await request(app)
      .post("/api/bookings")
      .set(authHeader(token))
      .send({ cabinType: "dj", startTime: laterStart, endTime: laterEnd, price: 25 });

    expect(res.status).toBe(201);
  });
});
