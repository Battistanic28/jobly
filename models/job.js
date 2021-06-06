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
   * Expects any or all of the input parameters as a query string... e.g. '/jobs?minSalary=150000&hasEquity=true'
   * Method uses a dyanmic operator based on the incoming request query to filter jobs by equity (true/false)
   * 
   * Returns { id, title, salary, equity, company_handle }
   * */

	static async filterBy(minSalary = 0, dynamicOperator) {
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
			[ minSalary ]
		);
		return jobsRes.rows;
	}

	/** Given a job id, return data about an open position.
   *
   * Returns { handle, name, description, numEmployees, logoUrl, jobs }
   *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if not found.
   **/

	static async get(id) {
		const jobRes = await db.query(
			`SELECT title,
                      salary,
                      equity,
                      company_handle AS companyHandle
            FROM jobs
            WHERE id = $1
            ORDER BY title`,
			[ id ]
		);

        const job = jobRes.rows[0];
		if (!job) throw new NotFoundError(`No job with ID: ${id}`);
		return job;
	}
    
  /** Update job data with `data`.
   *
   * Update requires all fields as part of request body.
   *
   * Data can include: {title, salary, equity, company_handle}
   *
   * Returns {title, salary, equity, company_handle}
   *
   * Throws NotFoundError if not found.
   */
    
	static async update(id, data) {
        const {title, salary, equity, company_handle} = data;
		const jobRes = await db.query(
			`UPDATE jobs
            SET title=$2,
                salary=$3,
                equity=$4,
                company_handle=$5
            WHERE id=$1
            RETURNING title,
            salary,
            equity,
            company_handle AS companyHandle`,
			[ id, title, salary, equity, company_handle ]
		);
        const job = jobRes.rows[0];
		if (!job) throw new NotFoundError(`No job with ID: ${id}`);
        return job;
	}

	/** Delete given job from database; returns undefined.
   *
   * Throws NotFoundError if job not found.
   **/

	static async remove(id) {
		const jobRes = await db.query(
			`DELETE
            FROM jobs
            WHERE id = $1
            RETURNING id`,
			[ id ]
		);
		const job = jobRes.rows[0];
		if (!job) throw new NotFoundError(`No job with ID: ${id}`);
	}
}

module.exports = Job;
