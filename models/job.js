'use strict';

const bodyParser = require('body-parser');
const db = require('../db');
const { BadRequestError, NotFoundError } = require('../expressError');
const { sqlForPartialUpdate } = require('../helpers/sql');

/** Related functions for companies. */

class Job {
	/** Create a job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, company_handle }
   *
   * Returns { title, salary, equity, company_handle }
   *
   * Throws BadRequestError if job already in database.
   * */

	static async create({title, salary, equity, company_handle}) {
        const result = await db.query(
            `INSERT INTO jobs
            (title, salary, equity, company_handle)
            VALUES ($1, $2, $3, $4)
            RETURNING title, salary, equity, company_handle AS companyHandle`,
            [
                title,
                salary,
                equity,
                company_handle
            ],
        );
        const job = result.rows[0];
        return job;
    }

	static async findAll() {
		const jobsRes = await db.query(
			`SELECT title,
                    salary,
                    equity,
                    company_handle AS companyHandle
            FROM jobs
            ORDER BY title`
		);
		return jobsRes.rows;
	}

	static async filterBy() {}

	static async get() {}

	static async update() {}

	static async remove() {}
}

module.exports = Job;
