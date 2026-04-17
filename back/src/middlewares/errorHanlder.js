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