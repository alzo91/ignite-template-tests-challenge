import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import connection from "../../../../database";

let conn: Connection;

describe("Get detail about statement", () => {
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

  it("should be able to detail current statement ", async () => {
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

    const resp_statement = await request(app)
      .post("/api/v1/statements/deposit")
      .set({ Authorization: `Bearer ${token}` })
      .send({ amount: 100, description: "received 02 test" });

    const { id } = resp_statement.body;
    // console.log(id);

    const resp_detail = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send();

    const statement = resp_detail.body;
    // console.log(statement);

    expect(statement.id).toBe(statement.id);
  });
});
