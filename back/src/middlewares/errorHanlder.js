export function errorHandler(res, err, req, next) {
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Error interno del servidor';


    console.error('Error capturado:', {
        status : statusCode,
        message,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
    });

    const response = { error: message, status: statusCode  };

    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
}