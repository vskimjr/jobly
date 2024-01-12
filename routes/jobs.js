"use strict";

/**Routes for jobs */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Job = require("../models/job");
const jobNewSchema = require("../schemas/jobNew.json");

const router = new express.Router();

/** POST /
 *
 * Takes JSON of { title, salary, equity, companyHandle } as input
 * via the request body and attempts to create a job in the database.
 *
 * Returns (job: { id, title, salary, equity, company_handle }}
 *
 * Authorization required: admin
 */
router.post("/", ensureAdmin, async function (req, res, next) {
  const validator = jsonschema.validate(
    req.body,
    jobNewSchema,
    { required: true }
  );
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const job = await Job.create(req.body);
  return res.status(201).json({ job });
});

/** GET /  =>
 *   { jobs: [ { id, title, salary, equity, company_handle }, ...] }
 *
 * Can filter in the future // TODO: add filtering
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next){
  const jobs = await Job.findAll();
  return res.json({ jobs });
})

/** GET /[id]  =>  { job }
 *
 *  Company is { id, title, salary, equity, company_handle }
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  const job = await Job.get(req.params.id);
  return res.json({ job });
});







module.exports = router;

