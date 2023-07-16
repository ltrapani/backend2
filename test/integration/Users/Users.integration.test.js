import chai from "chai";
import supertest from "supertest";
import logger from "../../../src/logger/logger.js";
import config from "../../../src/config/config.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing Users endpoint", () => {
  let userId;
  let cookie;

  after(async () => {
    try {
      const loginResult = await requester
        .post("/api/users/login")
        .send({ email: config.admin_email, password: config.admin_password });

      const cookieResult = loginResult.headers["set-cookie"][0];
      const cookieResultSplited = cookieResult.split("=");

      cookie = {
        name: cookieResultSplited[0],
        value: cookieResultSplited[1],
      };
      await requester
        .delete(`/api/users/${userId}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    } catch (error) {
      logger.error(error.message);
    }
  });

  it("Testing register a user", async () => {
    const userMock = {
      first_name: "Lisa",
      last_name: "Godoy",
      email: "lisa@gmail.com",
      age: 6,
      password: "123",
    };

    const { statusCode, _body } = await requester
      .post("/api/users/register")
      .send(userMock);

    userId = _body.id;

    expect(statusCode).to.be.eql(200);
    expect(_body.status).to.be.eql("success");
    expect(_body.message).to.be.eql("user registered");
  });

  it("Testing login user and storage a cookie", async () => {
    const credentialsMock = {
      email: "lisa@gmail.com",
      password: "123",
    };

    const loginResult = await requester
      .post("/api/users/login")
      .send(credentialsMock);

    const cookieResult = loginResult.headers["set-cookie"][0];
    const cookieResultSplited = cookieResult.split("=");

    cookie = {
      name: cookieResultSplited[0],
      value: cookieResultSplited[1],
    };

    expect(loginResult.statusCode).to.be.eql(200);
    expect(loginResult._body.status).to.be.eql("success");
    expect(loginResult._body.message).to.be.eql("login success");
  });

  it("Testing current. The cookie stored in the login is sent and obtain the user data", async () => {
    const { statusCode, _body } = await requester
      .get("/api/users/current")
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(statusCode).to.be.eql(200);
    expect(_body.user.email).to.be.eql("lisa@gmail.com");
  });
});
