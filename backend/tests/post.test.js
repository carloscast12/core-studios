import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import { registerUser } from "./helpers.js";

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

describe("Posts", () => {
  it("crea un post con texto válido", async () => {
    const { token } = await registerUser();
    const res = await request(app)
      .post("/api/posts")
      .set(authHeader(token))
      .field("text", "hola, este es mi primer post");

    expect(res.status).toBe(201);
    expect(res.body.text).toBe("hola, este es mi primer post");
  });

  it("rechaza un post con más de 120 caracteres", async () => {
    const { token } = await registerUser();
    const textoLargo = "a".repeat(121);
    const res = await request(app)
      .post("/api/posts")
      .set(authHeader(token))
      .field("text", textoLargo);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("máximo 120 caracteres");
  });

  it("pagina los resultados según page y limit", async () => {
    const { token } = await registerUser();
    for (let i = 1; i <= 7; i++) {
      await request(app)
        .post("/api/posts")
        .set(authHeader(token))
        .field("text", `post numero ${i}`);
    }

    const firstPage = await request(app)
      .get("/api/posts?page=1&limit=5")
      .set(authHeader(token));
    const secondPage = await request(app)
      .get("/api/posts?page=2&limit=5")
      .set(authHeader(token));

    expect(firstPage.body.length).toBe(5);
    expect(secondPage.body.length).toBe(2);
  });
});
