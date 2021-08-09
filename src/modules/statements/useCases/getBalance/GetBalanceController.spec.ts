import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import connection from "../../../../database";

let conn: Connection;

describe("Get balance", () => {
  beforeAll(async () => {
    conn = await connection();
    await conn.query(
      "DELETE FROM users WHERE email = 'test_balance@test.com.br'"
    );
  });

  afterAll(async () => {
    // await conn.query("DELETE FROM users WHERE email = 'test_auth@test.com.br'");
    await conn.close();
  });

  it("should be able to get balance", async () => {
    const user = {
      name: "Test Balance",
      email: "test_balance@test.com.br",
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
      .send({ amount: 100, description: "received 01 test" });

    await request(app)
      .post("/api/v1/statements/deposit")
      .set({ Authorization: `Bearer ${token}` })
      .send({ amount: 100, description: "received 02 test" });
    // console.log(statement01.body);

    await request(app)
      .post("/api/v1/statements/deposit")
      .set({ Authorization: `Bearer ${token}` })
      .send({ amount: 100, description: "received 03 test" });
    // console.log(statement02.body);

    await request(app)
      .post("/api/v1/statements/withdraw")
      .set({ Authorization: `Bearer ${token}` })
      .send({ amount: 50, description: "get money to pay bils" });
    // console.log(statement03.body);

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({ Authorization: `Bearer ${token}` })
      .send();

    // const balance = response.body;
    // console.log(response.body);
    // console.log(response.status);
    expect(response.status).toBe(200);
  });
});
