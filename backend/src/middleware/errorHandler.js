// Central place to catch anything thrown/rejected inside route handlers.
// Controllers call next(err) on unexpected failures; expected failures
// (bad input, not found, etc.) are handled inline with res.status(...).json(...).
function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Something went wrong." });
}

module.exports = errorHandler;
