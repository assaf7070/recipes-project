function notFound(req, res, next) {
  res.status(404).json({ error: true, message: 'Route not found', statusCode: 404 });
}

function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: true, message, statusCode: status });
}

module.exports = { notFound, errorHandler };
