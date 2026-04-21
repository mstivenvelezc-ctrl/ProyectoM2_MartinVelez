// validador comentarios    

// Validadores para comentarios
export function validarTitle(title) {
    if (!title) {
        return "el título es requerido";
    }
    if (typeof title !== "string") {
        return "el título debe ser una cadena de texto";
    }
    if (title.length < 5 || title.length > 200) {
        return "el título debe tener entre 5 y 200 caracteres";
    }
    return null;
}

// Validador para el contenido
export function validarContent(content) {
    if (!content) {
        return "el contenido es requerido";
    }
    if (typeof content !== "string") {
        return "el contenido debe ser una cadena de texto";
    }
    if (content.length < 20) {
        return "el contenido debe tener al menos 20 caracteres";
    }
    return null;
}


// Validador para el publicacion_id
export function validarPublicacionId(publicacion_id) {
    if (publicacion_id === undefined || publicacion_id === null) {
        return "el publicacion_id es requerido";
    }
    return null;
}


// Validador para el usuarios_id
export function validarUsuariosId(usuarios_id) {
    if (usuarios_id === undefined || usuarios_id === null) {
        return "el usuarios_id es requerido";
    }
    return null;
}


