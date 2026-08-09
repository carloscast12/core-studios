import request from "supertest";
import app from "../app.js";

export async function registerUser(overrides = {}) {
  const res = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Test User",
      email: `user-${Date.now()}-${Math.random()}@test.com`,
      password: "test1234",
      ...overrides,
    });
  return res.body;
}
