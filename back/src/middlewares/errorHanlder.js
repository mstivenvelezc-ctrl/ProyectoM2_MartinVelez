export function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Error interno del servidor';


// Log detallado del error para facilitar la depuración
    console.error('Error capturado:', {
        status : statusCode,
        message,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
    });

    const response = { error: message, status: statusCode  };

// Agrega stack trace solo en desarrollo para no exponer detalles en producción
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};


// Funciones helper para crear errores
export function notFound(message = 'No encontrado') {
    const error = new Error(message);
    error.statusCode = 404;
    return error;
}

export function badRequest(message = 'Solicitud inválida') {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
}

export function conflict(message = 'Conflicto') {
    const error = new Error(message);
    error.statusCode = 409;
    return error;
}

export function internalServerError(message = 'Error interno del servidor') {
    const error = new Error(message);
    error.statusCode = 500;
    return error;
}


