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
   * Returns { id, title, salary, equity, company_handle }
   *
   * Throws BadRequestError if job already in database.
   * */

	static async create({ title, salary, equity, company_handle }) {
		const result = await db.query(
			`INSERT INTO jobs
            (title, salary, equity, company_handle)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, salary, equity, company_handle AS companyHandle`,
			[ title, salary, equity, company_handle ]
		);
		const job = result.rows[0];
		return job;
	}

	static async findAll() {
		const jobsRes = await db.query(
			`SELECT id,
                    title,
                    salary,
                    equity,
                    company_handle AS companyHandle
            FROM jobs
            ORDER BY title`
		);
		return jobsRes.rows;
	}

	/** Filter jobs by min salary and equity offerings
   * Expects any or all of the input parameters as a query string... e.g. '/jobs?min=150000&hasEquity=true'
   *
   * Returns { id, title, salary, equity, company_handle }
   * */

	static async filterBy(minSalary=0, dynamicOperator= '>=') {
		const jobsRes = await db.query(
			`SELECT id,
                    title,
                    salary,
                    equity,
                    company_handle AS companyHandle
            FROM jobs
            WHERE salary >= $1
            AND equity ${dynamicOperator} 0
            ORDER BY title`,
            [minSalary]
		);
		return jobsRes.rows;
	}


	/** Given a job title, return data about an open position.
   *
   * Returns { handle, name, description, numEmployees, logoUrl, jobs }
   *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if not found.
   **/

	static async get(title) {
		const companyRes = await db.query(
			`SELECT title,
                      salary,
                      equity,
                      company_handle AS companyHandle
            FROM jobs
            ORDER BY title`,
            [title]
		);

		const company = companyRes.rows[0];

		if (!company) throw new NotFoundError(`No company: ${handle}`);

		return company;
	}

	static async update() {}

	static async remove() {}
}

module.exports = Job;
