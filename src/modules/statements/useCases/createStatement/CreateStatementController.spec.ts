import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import connection from "../../../../database";

let conn: Connection;

describe("Get balance", () => {
  beforeAll(async () => {
    conn = await connection();
    await conn.query(
      "DELETE FROM users WHERE email = 'test_statement@test.com'"
    );
  });

  afterAll(async () => {
    // await conn.query("DELETE FROM users");
    await conn.close();
  });

  it("should be able to create a new statement with deposit", async () => {
    const user = {
      name: "Test Statetement",
      email: "test_statement@test.com",
      password: "123456",
    };
    // create user
    await request(app).post("/api/v1/users").send(user);
    // session
    const resp = await request(app).post("/api/v1/sessions").send(user);
    const { token } = resp.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .set({ Authorization: `Bearer ${token}` })
      .send({ amount: 500, description: "received test" });

    const statement = response.body;
    // console.log(statement);
    expect(response.status).toBe(201);
    expect(statement).toHaveProperty("id");
    expect(statement.type).toBe("deposit");
  });

  it("should be able to create a new statement with withdraw", async () => {
    const user = {
      name: "Test Statetement",
      email: "test_statement@test.com",
      password: "123456",
    };
    // create user
    await request(app).post("/api/v1/users").send(user);
    // session
    const resp = await request(app).post("/api/v1/sessions").send(user);
    const { token } = resp.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .set({ Authorization: `Bearer ${token}` })
      .send({ amount: 500, description: "received test" });

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .set({ Authorization: `Bearer ${token}` })
      .send({ amount: 100, description: "received test" });

    const statement = response.body;
    // console.log(statement);
    expect(response.status).toBe(201);
    expect(statement).toHaveProperty("id");
    expect(statement.type).toBe("withdraw");
  });
});
