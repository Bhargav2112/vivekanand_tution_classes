const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object') {
    const sanitized = {};

    for (const [key, childValue] of Object.entries(value)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }

      if (typeof key === 'string' && key.startsWith('$')) {
        continue;
      }

      sanitized[key] = sanitizeValue(childValue);
    }

    return sanitized;
  }

  return value;
};

const sanitizeRequestData = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    const sanitizedBody = sanitizeValue(req.body);
    for (const key of Object.keys(req.body)) {
      delete req.body[key];
    }
    Object.assign(req.body, sanitizedBody);
  }

  if (req.query && typeof req.query === 'object') {
    const sanitizedQuery = sanitizeValue(req.query);
    for (const key of Object.keys(req.query)) {
      delete req.query[key];
    }
    Object.assign(req.query, sanitizedQuery);
  }

  if (req.params && typeof req.params === 'object') {
    const sanitizedParams = sanitizeValue(req.params);
    for (const key of Object.keys(req.params)) {
      delete req.params[key];
    }
    Object.assign(req.params, sanitizedParams);
  }

  next();
};

module.exports = sanitizeRequestData;
