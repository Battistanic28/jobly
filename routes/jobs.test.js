"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Job = require("../models/job");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u3Token
  } = require("./_testCommon");
  
  beforeAll(commonBeforeAll);
  beforeEach(commonBeforeEach);
  afterEach(commonAfterEach);
  afterAll(commonAfterAll);

  /************************************** GET /jobs */

  describe("GET /jobs", function () {
    test("works for jobs", async function () {
      const resp = await request(app)
          .get("/jobs")
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual({
        jobs: [
          {
            title: "c1_job",
            salary: 150000,
            equity: "0",
            companyhandle: "c1",
          },
          {
            title: "c3_job",
            salary: 90000,
            equity: "0",
            companyhandle: "c3",
          },
        ],
      });
    });
  });

    /************************************** GET /jobs */

    // describe("GET /jobs/:id", function () {
    //     test("works for jobs", async function () {
    //       const resp = await request(app)
    //           .get("/jobs/1")
    //           .set("authorization", `Bearer ${u1Token}`);
    //       expect(resp.body).toEqual({
    //         jobs: [
    //           {
    //             title: "c1_job",
    //             salary: 150000,
    //             equity: "0",
    //             companyhandle: "c1",
    //           },
    //         ],
    //       });
    //     });
    //   });