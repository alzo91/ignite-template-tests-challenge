import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import connection from "../../../../database";

let conn: Connection;

describe("Create a session to user", () => {
  beforeAll(async () => {
    conn = await connection();
    await conn.runMigrations();
  });

  afterAll(async () => {
    await conn.query("DELETE FROM users WHERE email = 'test_auth@test.com.br'");
    await conn.close();
  });

  it("should be able to create a new token to user", async () => {
    const user = {
      name: "Test Auth",
      email: "test_auth@test.com.br",
      password: "123456",
    };

    await request(app).post("/api/v1/users").send(user);

    const response = await request(app).post("/api/v1/sessions").send(user);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should not be able to create a token if user doesn't exist", async () => {
    const user = {
      name: "Test Auth 02 ",
      email: "test_auth02@test.com.br",
      password: "123456",
    };

    const response = await request(app).post("/api/v1/sessions").send(user);
    expect(response.status).toBe(401);
  });
});
