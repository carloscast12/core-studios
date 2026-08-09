import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import { registerUser } from "./helpers.js";

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

describe("Follows", () => {
  it("permite seguir a otro usuario", async () => {
    const userA = await registerUser();
    const userB = await registerUser();

    const res = await request(app)
      .post(`/api/follows/${userB.user.id}`)
      .set(authHeader(userA.token));

    expect(res.status).toBe(201);
  });

  it("no permite seguirse a uno mismo", async () => {
    const userA = await registerUser();

    const res = await request(app)
      .post(`/api/follows/${userA.user.id}`)
      .set(authHeader(userA.token));

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("no puedes seguirte a ti mismo");
  });

  it("no permite seguir dos veces al mismo usuario", async () => {
    const userA = await registerUser();
    const userB = await registerUser();

    await request(app)
      .post(`/api/follows/${userB.user.id}`)
      .set(authHeader(userA.token));

    const res = await request(app)
      .post(`/api/follows/${userB.user.id}`)
      .set(authHeader(userA.token));

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("ya sigues a este usuario");
  });

  it("permite dejar de seguir, y luego el conteo de seguidos baja", async () => {
    const userA = await registerUser();
    const userB = await registerUser();

    await request(app)
      .post(`/api/follows/${userB.user.id}`)
      .set(authHeader(userA.token));

    await request(app)
      .delete(`/api/follows/${userB.user.id}`)
      .set(authHeader(userA.token));

    const stats = await request(app)
      .get("/api/users/stats")
      .set(authHeader(userA.token));

    expect(stats.body.following).toBe(0);
  });
});
