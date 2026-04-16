// validador publicaciones

// Validadores para publicaciones
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

// Validador para el usuarios_id
export function validarUsuariosId(usuarios_id) {
    if (usuarios_id === undefined || usuarios_id === null) {
        return "el usuarios_id es requerido";
    }
    return null;
}

// Validador para el campo published
export function validarPublished(published) {
    if (published === undefined) {
        return null; // El campo es opcional, no hay error si no se proporciona
    }
    if (typeof published !== "boolean") {
        return "el campo published debe ser un booleano";
    }
    return null;
}
