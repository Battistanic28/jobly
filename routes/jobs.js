"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError, ExpressError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
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
            let equity = req.query.equity;
            let dynamicOperator = '>='
            if (equity === 'true') {
                dynamicOperator = '>';
            } else if (equity === 'false') {
                dynamicOperator = '=';
            }
            console.log('dynamicOperator', dynamicOperator)
            jobs = await Job.filterBy(minSalary, dynamicOperator); 
        } else {
            jobs = await Job.findAll();
        }
        return res.json({ jobs });
    } catch (err) {
        return next(err);
    }
})



module.exports = router;