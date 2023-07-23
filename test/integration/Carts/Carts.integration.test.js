import chai from "chai";
import supertest from "supertest";
import config from "../../../src/config/config.js";

const expect = chai.expect;
const requester = supertest(`${config.host_url}`);

describe("Testing Carts endpoint", () => {
  let cookie;

  it("Testing create an empty cart", async () => {
    const loginResult = await requester
      .post("/api/users/login")
      .send({ email: config.admin_email, password: config.admin_password });

    const cookieResult = loginResult.headers["set-cookie"][0];
    const cookieResultSplited = cookieResult.split("=");

    cookie = {
      name: cookieResultSplited[0],
      value: cookieResultSplited[1],
    };

    expect(loginResult.statusCode).to.be.eql(200);
    expect(loginResult._body.status).to.be.eql("success");
    expect(loginResult._body.message).to.be.eql("login success");

    const createCartResult = await requester
      .post("/api/carts")
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(createCartResult.statusCode).to.be.eql(200);
    expect(createCartResult._body.status).to.be.eql("success");
    expect(createCartResult._body.message).to.be.eql("Cart created");
    expect(Array.isArray(createCartResult._body.response.products)).to.be.eql(
      true
    );
    expect(createCartResult._body.response.products.length).to.be.eql(0);
  });
});
