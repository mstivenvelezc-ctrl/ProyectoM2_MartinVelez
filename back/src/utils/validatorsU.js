// validador usuarios

// Validador para el email
export function validarEmail(email) {
    if (!email) { 
        return "el email es requerido";
    }
    const emailRegex = /^[^\s@]+@+[^\s@]+\.[^\s@]+$/; 
    if (!emailRegex.test(email)) {
        return "el email no es válido";
    }
    return null; // null indica que no hay errores
}

// Validador para el nombre
export function validarName(name) {
    if (name === undefined || name === null ) {
        return "el nombre es requerido";
    }
    if (typeof name !== "string" ) { 
        return "el nombre debe ser una cadena de texto";
    }
    if (typeof name.trim().length === 0) {
        return "el nombre no puede estar vacío";
    }
    if (name.length < 2 ) {
        return "el nombre debe tener al menos 2 caracteres y no más de 100";
    }
    if (name.length > 100) {
        return "el nombre no puede tener más de 100 caracteres";
    }
    return null; // null indica que no hay errores
}

// Validador para la biografía
export function validarBio(bio) {
    if (bio === undefined) {
        return null;
    }
    if (typeof bio !== "string" || bio.length < 10 || bio.length > 200) {
        return "la biografía debe tener al menos 10 caracteres y no más de 200";
    }
    return null; // null indica que no hay errores

}