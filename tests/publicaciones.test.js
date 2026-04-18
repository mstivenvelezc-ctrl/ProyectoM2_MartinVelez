import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../back/src/app.js';
import pool from '../back/src/db/config.js';

// Usuario de prueba que se usará como autor
const USUARIO_ID = 1; // Asegúrate que este ID exista en tu BD

// GET /api/publicaciones
describe("GET /api/publicaciones", () => {
    test("devuelve una lista de publicaciones", async () => {
        const response = await request(app).get("/api/publicaciones");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("filtra publicaciones por published=true", async () => {
        const response = await request(app).get("/api/publicaciones?published=true");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach(p => expect(p.published).toBe(true));
    });

    test("filtra publicaciones por published=false", async () => {
        const response = await request(app).get("/api/publicaciones?published=false");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach(p => expect(p.published).toBe(false));
    });
});

// GET /api/publicaciones/:id
describe("GET /api/publicaciones/:id", () => {
    test("devuelve 404 si la publicación no existe", async () => {
        const response = await request(app).get("/api/publicaciones/9999");

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Publicación no encontrada");
    });
});

// POST /api/publicaciones
describe("POST /api/publicaciones", () => {
    beforeEach(async () => {
        await pool.query("DELETE FROM publicaciones WHERE title = 'Título de prueba válido'");
    });
    afterEach(async () => {
        await pool.query("DELETE FROM publicaciones WHERE title = 'Título de prueba válido'");
    });

    test("crea una nueva publicación", async () => {
        const response = await request(app)
            .post("/api/publicaciones")
            .send({
                title: "Título de prueba válido",
                content: "Este es un contenido de prueba que tiene más de 20 caracteres.",
                usuarios_id: USUARIO_ID,
                published: false
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("title", "Título de prueba válido");
        expect(response.body).toHaveProperty("content");
        expect(response.body).toHaveProperty("usuarios_id", USUARIO_ID);
    });

    test("rechaza publicación sin título", async () => {
        const response = await request(app)
            .post("/api/publicaciones")
            .send({
                content: "Este es un contenido de prueba que tiene más de 20 caracteres.",
                usuarios_id: USUARIO_ID
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toContain("requerido");
    });

    test("rechaza publicación con título menor a 5 caracteres", async () => {
        const response = await request(app)
            .post("/api/publicaciones")
            .send({
                title: "Abc",
                content: "Este es un contenido de prueba que tiene más de 20 caracteres.",
                usuarios_id: USUARIO_ID
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain("entre 5 y 200 caracteres");
    });

    test("rechaza publicación sin contenido", async () => {
        const response = await request(app)
            .post("/api/publicaciones")
            .send({
                title: "Título de prueba válido",
                usuarios_id: USUARIO_ID
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toContain("requerido");
    });

    test("rechaza publicación con contenido menor a 20 caracteres", async () => {
        const response = await request(app)
            .post("/api/publicaciones")
            .send({
                title: "Título de prueba válido",
                content: "Corto",
                usuarios_id: USUARIO_ID
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain("al menos 20 caracteres");
    });

    test("rechaza publicación sin usuarios_id", async () => {
        const response = await request(app)
            .post("/api/publicaciones")
            .send({
                title: "Título de prueba válido",
                content: "Este es un contenido de prueba que tiene más de 20 caracteres."
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain("requerido");
    });

    test("rechaza publicación con usuarios_id inexistente", async () => {
        const response = await request(app)
            .post("/api/publicaciones")
            .send({
                title: "Título de prueba válido",
                content: "Este es un contenido de prueba que tiene más de 20 caracteres.",
                usuarios_id: 9999
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe("El autor especificado no existe");
    });

    test("rechaza published con valor no booleano", async () => {
        const response = await request(app)
            .post("/api/publicaciones")
            .send({
                title: "Título de prueba válido",
                content: "Este es un contenido de prueba que tiene más de 20 caracteres.",
                usuarios_id: USUARIO_ID,
                published: "sí"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain("debe ser un booleano");
    });
});

// PUT /api/publicaciones/:id
describe("PUT /api/publicaciones/:id", () => {
    test("devuelve 404 si la publicación no existe", async () => {
        const response = await request(app)
            .put("/api/publicaciones/9999")
            .send({
                title: "Título actualizado válido",
                content: "Este es un contenido actualizado que tiene más de 20 caracteres.",
                published: false
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe("Publicación no encontrada");
    });

    test("rechaza actualización con título muy corto", async () => {
        const response = await request(app)
            .put("/api/publicaciones/1")
            .send({
                title: "Abc",
                content: "Este es un contenido actualizado que tiene más de 20 caracteres."
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain("entre 5 y 200 caracteres");
    });
});

// DELETE /api/publicaciones/:id
describe("DELETE /api/publicaciones/:id", () => {
    test("devuelve 404 si la publicación no existe", async () => {
        const response = await request(app).delete("/api/publicaciones/9999");

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe("Publicación no encontrada");
    });
});

// GET /api/publicaciones/usuarios/:usuarioId
describe("GET /api/publicaciones/usuarios/:usuarioId", () => {
    test("devuelve lista vacía si el usuario no tiene publicaciones", async () => {
        const response = await request(app).get("/api/publicaciones/usuarios/9999");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});