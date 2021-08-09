import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import connection from "../../../../database";

let conn: Connection;

describe("Show user profile", () => {
  beforeAll(async () => {
    conn = await connection();
  });

  afterAll(async () => {
    await conn.query(
      "DELETE FROM users WHERE email = 'test_profile@test.com.br'"
    );
    await conn.close();
  });

  it("should be able to show users profile", async () => {
    const user = {
      name: "Test Profile",
      email: "test_profile@test.com.br",
      password: "123456",
    };

    await request(app).post("/api/v1/users").send(user);

    const resp = await request(app).post("/api/v1/sessions").send(user);
    const { token } = resp.body;
    // console.log(`token ${token}`);
    const response = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Beare ${token}` })
      .send();
    const profile = response.body;

    // console.log(profile);
    expect(response.status).toBe(200);
    expect(profile).toHaveProperty("id");
  });
});
