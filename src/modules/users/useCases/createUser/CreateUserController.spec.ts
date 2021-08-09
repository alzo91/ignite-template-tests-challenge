import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import connection from "../../../../database";

let conn: Connection;

describe("Create a new user", () => {
  beforeAll(async () => {
    conn = await connection();
    await conn.runMigrations();
  });

  afterAll(async () => {
    await conn.query("DELETE FROM users  WHERE email = 'test01@test.com.br'");
    await conn.query("DELETE FROM users  WHERE email = 'test02@test.com.br'");
    conn.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Test 01",
      email: "test01@test.com.br",
      password: "123456",
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to a user if e-mail already exist", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test 02",
      email: "test02@test.com.br",
      password: "123456",
    });

    const response = await request(app).post("/api/v1/users").send({
      name: "Test 02",
      email: "test02@test.com.br",
      password: "123456",
    });

    expect(response.status).toBe(400);
  });
});
