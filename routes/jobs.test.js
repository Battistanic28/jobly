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
            id: expect.any(Number),
            title: "c1_job",
            salary: 150000,
            equity: "0",
            companyhandle: "c1",
          },
          {
            id: expect.any(Number),
            title: "c3_job",
            salary: 90000,
            equity: "0.05",
            companyhandle: "c3",
          },
        ],
      });
    });

    test("filters for jobs with equity", async function () {
      const resp = await request(app)
          .get("/jobs?hasEquity=true")
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual({
        jobs: [
          {
            id: expect.any(Number),
            title: "c3_job",
            salary: 90000,
            equity: "0.05",
            companyhandle: "c3",
          },
        ],
      });
    });

    test("filters for jobs based on min salary", async function () {
      const resp = await request(app)
          .get("/jobs?minSalary=100000")
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual({
        jobs: [
          {
            id: expect.any(Number),
            title: "c1_job",
            salary: 150000,
            equity: "0",
            companyhandle: "c1",
          },
        ],
      });
    });

  });

    /************************************** GET /jobs/:id */

    describe("GET /jobs/:id", function () {
      test("works for jobs", async function () {
        const findId = await request(app)
            .get("/jobs")
            .set("authorization", `Bearer ${u1Token}`);
        const jobId = findId.body.jobs[0].id;

        const resp = await request(app)
          .get(`/jobs/${jobId}`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual({
        "job": {
          id: expect.any(Number),
          title: "c1_job",
          salary: 150000,
          equity: "0",
          companyhandle: "c1",
        }
      });
      });

    });

    /************************************** PATCH /jobs/:id */

    describe("PATCH /jobs/:id", function () {
      test("works for jobs", async function () {
        const findId = await request(app)
            .get("/jobs")
            .set("authorization", `Bearer ${u1Token}`);
        const jobId = findId.body.jobs[0].id;

        const resp = await request(app)
          .patch(`/jobs/${jobId}`)
          .send({
            id: expect.any(Number),
            title: "c1_job_new",
            salary: 150000,
            equity: "0",
            company_handle: "c1",
          })
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual({
        "job": {
          title: "c1_job_new",
          salary: 150000,
          equity: "0",
          companyhandle: "c1",
        }
      });
      });

    });

    /************************************** DELETE /jobs/:handle */

    describe("DELETE /jobs/:id", function () {
      test("works for jobs", async function () {
        const findId = await request(app)
            .get("/jobs")
            .set("authorization", `Bearer ${u1Token}`);
        const jobId = findId.body.jobs[0].id;

        const resp = await request(app)
          .delete(`/jobs/${jobId}`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual({ deleted: `${jobId}` });
      });

    });