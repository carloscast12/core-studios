import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Auth", () => {
  it("registra un usuario nuevo y devuelve token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Carlos",
      email: "carlos@test.com",
      password: "test1234",
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe("carlos@test.com");
  });

  it("rechaza el registro si el email ya existe", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Carlos",
      email: "carlos@test.com",
      password: "test1234",
    });
    const res = await request(app).post("/api/auth/register").send({
      name: "Otro Carlos",
      email: "carlos@test.com",
      password: "otraClave",
    });
    expect(res.status).toBe(400);
  });

  it("permite login con credenciales correctas", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Carlos",
      email: "carlos@test.com",
      password: "test1234",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: "carlos@test.com",
      password: "test1234",
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });

  it("rechaza login con contraseña incorrecta", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Carlos",
      email: "carlos@test.com",
      password: "test1234",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: "carlos@test.com",
      password: "claveEquivocada",
    });
    expect(res.status).toBe(400);
  });

  it("rechaza login con email que no existe", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nadie@test.com",
      password: "test1234",
    });
    expect(res.status).toBe(400);
  });
});
