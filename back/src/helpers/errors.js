export function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}


export const badRequest = (message) => createError(message, 400);
export const notFound = (message) => createError(message, 404);
export const conflict = (message) => createError(message, 409);
export const internalError = (message = 'Error interno del servidor') => createError(message, 500);
export const unauthorized = (message) => createError(message, 401);
export const forbidden = (message) => createError(message, 403);