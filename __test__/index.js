const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");

const _url = "http://127.0.0.1:3000";
const table = "/users";

describe("POST /:collection", () => {
  // post
  it("should create a new table and insert data", (done) => {
    const _body = {
      email: "deepbag92@gmail.com",
      phone: "9893993028",
      name: "Deep Bag",
    };

    // request a post method
    request(_url)
      .post(table) // route path
      .send(_body) // body
      .expect(200) // expected status code
      .end((err, res) => {
        if (err) return done(err);
        // done with success
        expect(res.body).to.have.property("status", 200); // response
        done();
      });
  });

  // get
  it("should retrieve specific data by ID", (done) => {
    const _param = {
      id: 1,
    };
    // request a get method
    request(_url)
      .get(`${table}/${_param.id}`) // route path
      .expect(200) // expected status code
      .end((err, res) => {
        if (err) return done(err);
        // done with success
        expect(res.body).to.have.property("status", 200); // response
        done();
      });
  });

  // update
  it("should update specific data by ID", (done) => {
    const _param = {
      id: 1,
    };
    const _body = {
      email: "deepbag92@gmail.com",
      phone: "9893993028",
      name: "Deep Bag 2",
    };
    // request a get method
    request(_url)
      .post(`${table}/${_param.id}`) // route path
      .send(_body) // body
      .expect(200) // expected status code
      .end((err, res) => {
        if (err) return done(err);
        // done with success
        expect(res.body).to.have.property("status", 200); // response
        done();
      });
  });

  // delete
  it("should delete specific data by ID", (done) => {
    const _param = {
      id: 1,
    };
    // request a get method
    request(_url)
      .delete(`${table}/${_param.id}`) // route path
      .expect(200) // expected status code
      .end((err, res) => {
        if (err) return done(err);
        // done with success
        expect(res.body).to.have.property("status", 200); // response
        done();
      });
  });
});
