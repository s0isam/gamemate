const validateRequest = (schemas) => (req, res, next) => {
  const validated = {};

  for (const [location, schema] of Object.entries(schemas)) {
    const result = schema.safeParse(location === 'query' ? req.query : req[location]);

    if (!result.success) {
      const error = new Error('Request validation failed');
      error.statusCode = 400;
      error.details = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      return next(error);
    }

    validated[location] = result.data;
  }

  req.validated = validated;
  if (validated.body) req.body = validated.body;
  if (validated.params) req.params = validated.params;
  next();
};

module.exports = validateRequest;
