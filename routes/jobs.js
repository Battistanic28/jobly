"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError, ExpressError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin, ensureOwnerOrAdmin } = require("../middleware/auth");
const Job = require("../models/job");

const jobNewSchema = require("../schemas/jobNew.json");
// const companyUpdateSchema = require("../schemas/companyUpdate.json");

const router = new express.Router();


router.post("/", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, jobNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const job = await Job.create(req.body);
        return res.status(201).json({ job });
    } catch (err) {
        return next(err);
    }
});

router.get("/", async function(req, res, next) {
    let jobs;
    try {
        if(Object.keys(req.query).length !== 0) {
            let minSalary = req.query.minSalary;
            let hasEquity = req.query.hasEquity;
            let dynamicOperator = '>='
            if (hasEquity === 'true') {
                dynamicOperator = '>';
            } else if (hasEquity === 'false') {
                dynamicOperator = '=';
            }
            jobs = await Job.filterBy(minSalary, dynamicOperator); 
        } else {
            jobs = await Job.findAll();
        }
        return res.json({ jobs });
    } catch (err) {
        return next(err);
    }
})

router.get("/:id", async function (req, res, next) {
    try {
      const job = await Job.get(req.params.id);
      return res.json({ job });
    } catch (err) {
      return next(err);
    }
  });

router.patch("/:id", ensureOwnerOrAdmin, async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, jobNewSchema);
        if (!validator.valid) {
          const errs = validator.errors.map(e => e.stack);
          throw new BadRequestError(errs);
        }
        const job = await Job.update(req.params.id, req.body);
        return res.json({ job });
      } catch (err) {
        return next(err);
      }
})

router.delete("/:id", ensureOwnerOrAdmin, async function (req, res, next) {
    try {
      await Job.remove(req.params.id);
      return res.json({ deleted: req.params.id });
    } catch (err) {
      return next(err);
    }
  });


module.exports = router;