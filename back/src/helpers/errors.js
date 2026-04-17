export function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}


export const badRequest = (message = 'Solicitud incorrecta') => createError(message, 400);
export const notFound = (message = 'Recurso no encontrado') => createError(message, 404);
export const conflict = (message = 'Conflicto de datos') => createError(message, 409);
export const internalError = (message = 'Error interno del servidor') => createError(message, 500);
export const unauthorized = (message = 'No autorizado') => createError(message, 401);
export const forbidden = (message = 'Acceso denegado') => createError(message, 403);