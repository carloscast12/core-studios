import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import { registerUser, loginUser } from "./helpers.js";
import User from "../src/models/User.js";

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

async function makeAdmin(userId) {
  await User.findByIdAndUpdate(userId, { role: "admin" });
}

describe("Eliminar usuario", () => {
  it("al eliminar un usuario, se quita su like de los posts de otros (no queda huérfano)", async () => {
    const admin = await registerUser();
    await makeAdmin(admin.user.id);
    const freshAdmin = await loginUser(admin.user.email); // token con el role actualizado

    const author = await registerUser();
    const liker = await registerUser();

    const postRes = await request(app)
      .post("/api/posts")
      .set(authHeader(author.token))
      .field("text", "post de prueba");
    const postId = postRes.body._id;

    await request(app)
      .put(`/api/posts/${postId}/like`)
      .set(authHeader(liker.token));

    const beforeDelete = await request(app)
      .get(`/api/posts/${postId}`)
      .set(authHeader(author.token));
    expect(beforeDelete.body.post.likes).toContain(liker.user.id);

    await request(app)
      .delete(`/api/users/${liker.user.id}`)
      .set(authHeader(freshAdmin.token));

    const afterDelete = await request(app)
      .get(`/api/posts/${postId}`)
      .set(authHeader(author.token));
    expect(afterDelete.body.post.likes).not.toContain(liker.user.id);
  });
});
