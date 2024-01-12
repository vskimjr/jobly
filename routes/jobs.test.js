"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");
const { NotFoundError } = require("../expressError");
const Job = require("../models/job");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function () {
  const newJob = {
    title: "testNew",
    salary: 1000,
    equity: 0.5,
    companyHandle: "test"
  };

  test("ok for admins", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send(newJob)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual(
      {
        job: {
          id: expect.any(Number),
          title: "testNew",
          salary: 1000,
          equity: '0.5',
          companyHandle: "test"
        }
      });
  });

  test("not ok for non-admin users", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send(newJob)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data - admin", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: "testNew",
        salary: 1000,
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data - admin", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: "testNew",
        salary: "salary", //this is the invalid line
        companyHandle: "test"
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("unauthorized nonadmin with invalid data", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: "testNew",
        salary: "salary", //this is the invalid line
        companyHandle: "test"
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

});