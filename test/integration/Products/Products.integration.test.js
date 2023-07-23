import chai from "chai";
import supertest from "supertest";
import config from "../../../src/config/config.js";

const expect = chai.expect;
const requester = supertest(`${config.host_url}`);

describe("Testing Products endpoint", () => {
  let cookie;

  it("Testing post product", async () => {
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

    const productMock = {
      title: "testing title",
      description: "testing description",
      code: "testing",
      price: 1,
      stock: 1,
      category: "testing category",
    };

    const addProductResult = await requester
      .post("/api/products")
      .send(productMock)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    const { _id } = addProductResult._body.response;

    expect(addProductResult.statusCode).to.be.eql(200);
    expect(addProductResult._body.status).to.be.eql("success");
    expect(addProductResult._body.message).to.be.eql("Product added");

    const deleteProductResult = await requester
      .delete(`/api/products/${_id}`)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(deleteProductResult.statusCode).to.be.eql(200);
    expect(deleteProductResult._body.status).to.be.eql("success");
    expect(deleteProductResult._body.message).to.be.eql("Product delete");
  });

  it("Testing get products pagination", async () => {
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

    const productsPaginationResult = await requester
      .get("/api/products")
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(productsPaginationResult.statusCode).to.be.eql(200);
    expect(productsPaginationResult._body.status).to.be.eql("success");
    expect(Array.isArray(productsPaginationResult._body.payload)).to.be.eql(
      true
    );
  });
});
