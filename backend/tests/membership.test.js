import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import { registerUser, loginUser } from "./helpers.js";
import User from "../src/models/User.js";

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

async function makeAdmin(userId) {
  await User.findByIdAndUpdate(userId, { role: "admin" });
}

describe("Membresías", () => {
  it("un admin puede crear una membresía para un usuario", async () => {
    const admin = await registerUser();
    await makeAdmin(admin.user.id);
    admin.token = (await loginUser(admin.user.email)).token; // el token viejo aún tenía role "user"
    const member = await registerUser();

    const res = await request(app)
      .post("/api/memberships")
      .set(authHeader(admin.token))
      .send({ email: member.user.email, plan: "basic" });

    expect(res.status).toBe(201);
    expect(res.body.hoursRemaining).toBe(10);
  });

  it("un usuario normal no puede crear membresías", async () => {
    const user = await registerUser();
    const other = await registerUser();

    const res = await request(app)
      .post("/api/memberships")
      .set(authHeader(user.token))
      .send({ userId: other.user.id, plan: "basic" });

    expect(res.status).toBe(403);
  });

  it("una reserva se cubre con las horas de la membresía si alcanzan", async () => {
    const admin = await registerUser();
    await makeAdmin(admin.user.id);
    admin.token = (await loginUser(admin.user.email)).token; // el token viejo aún tenía role "user"
    const member = await registerUser();
    await request(app)
      .post("/api/memberships")
      .set(authHeader(admin.token))
      .send({ email: member.user.email, plan: "basic" });

    const start = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const end = new Date(start.getTime() + 1000 * 60 * 60 * 2);
    const res = await request(app)
      .post("/api/bookings")
      .set(authHeader(member.token))
      .send({ cabinType: "dj", startTime: start, endTime: end, price: 45 });

    expect(res.status).toBe(201);
    expect(res.body.coveredByMembership).toBe(true);
    expect(res.body.price).toBe(0);

    const membership = await request(app)
      .get("/api/memberships/me")
      .set(authHeader(member.token));
    expect(membership.body.hoursRemaining).toBe(8);
  });

  it("una reserva se cobra normal si no alcanzan las horas de la membresía", async () => {
    const admin = await registerUser();
    await makeAdmin(admin.user.id);
    admin.token = (await loginUser(admin.user.email)).token; // el token viejo aún tenía role "user"
    const member = await registerUser();
    await request(app)
      .post("/api/memberships")
      .set(authHeader(admin.token))
      .send({ email: member.user.email, plan: "basic" });

    const start = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const end = new Date(start.getTime() + 1000 * 60 * 60 * 20); // 20h, más que las 10 del plan

    const res = await request(app)
      .post("/api/bookings")
      .set(authHeader(member.token))
      .send({ cabinType: "dj", startTime: start, endTime: end, price: 200 });

    expect(res.status).toBe(201);
    expect(res.body.coveredByMembership).toBe(false);
    expect(res.body.price).toBe(200);
  });

  it("no deja cancelar la membresía antes de los 3 meses de permanencia", async () => {
    const admin = await registerUser();
    await makeAdmin(admin.user.id);
    admin.token = (await loginUser(admin.user.email)).token; // el token viejo aún tenía role "user"
    const member = await registerUser();
    await request(app)
      .post("/api/memberships")
      .set(authHeader(admin.token))
      .send({ email: member.user.email, plan: "basic" });

    const res = await request(app)
      .delete("/api/memberships/me")
      .set(authHeader(member.token));

    expect(res.status).toBe(403);
    expect(res.body.cancelableFrom).toBeDefined();
  });
});
