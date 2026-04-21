import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/db/config.js';

const PUBLICACION_ID = 26;
const USUARIO_ID = 1;

// GET /api/comentarios
describe("GET /api/comentarios", () => {
    test("devuelve una lista de comentarios", async () => {
        const response = await request(app).get("/api/comentarios");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

// GET /api/comentarios/:id
describe("GET /api/comentarios/:id", () => {
    test("devuelve 404 si el comentario no existe", async () => {
        const response = await request(app).get("/api/comentarios/9999");

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Comentario no encontrado");
    });
});

// POST /api/comentarios
describe("POST /api/comentarios", () => {
    beforeEach(async () => {
        await pool.query("DELETE FROM comentarios WHERE content = 'Este es un contenido de prueba que tiene más de 20 caracteres.'");
    });
    afterEach(async () => {
        await pool.query("DELETE FROM comentarios WHERE content = 'Este es un contenido de prueba que tiene más de 20 caracteres.'");
    });



    test("crea un nuevo comentario", async () => {
        const response = await request(app)
            .post("/api/comentarios")
            .send({
                publicacion_id: PUBLICACION_ID,
                usuarios_id: USUARIO_ID,
                content: "Este es un contenido de prueba que tiene más de 20 caracteres."
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("content");
        expect(response.body).toHaveProperty("publicacion_id", PUBLICACION_ID);
        expect(response.body).toHaveProperty("usuarios_id", USUARIO_ID);
    });

    test("rechaza comentario sin content", async () => {
        const response = await request(app)
            .post("/api/comentarios")
            .send({
                publicacion_id: PUBLICACION_ID,
                usuarios_id: USUARIO_ID
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toContain("requerido");
    });

    test("rechaza comentario con content menor a 20 caracteres", async () => {
        const response = await request(app)
            .post("/api/comentarios")
            .send({
                publicacion_id: PUBLICACION_ID,
                usuarios_id: USUARIO_ID,
                content: "Corto"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain("al menos 20 caracteres");
    });

    test("rechaza comentario sin publicacion_id", async () => {
        const response = await request(app)
            .post("/api/comentarios")
            .send({
                usuarios_id: USUARIO_ID,
                content: "Este es un contenido de prueba que tiene más de 20 caracteres."
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain("requerido");
    });

    test("rechaza comentario sin usuarios_id", async () => {
        const response = await request(app)
            .post("/api/comentarios")
            .send({
                publicacion_id: PUBLICACION_ID,
                content: "Este es un contenido de prueba que tiene más de 20 caracteres."
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain("requerido");
    });

    test("rechaza comentario con publicacion_id inexistente", async () => {
        const response = await request(app)
            .post("/api/comentarios")
            .send({
                publicacion_id: 9999,
                usuarios_id: USUARIO_ID,
                content: "Este es un contenido de prueba que tiene más de 20 caracteres."
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe("El autor especificado no existe");
    });
});

// PUT /api/comentarios/:id
describe("PUT /api/comentarios/:id", () => {
    test("devuelve 404 si el comentario no existe", async () => {
        const response = await request(app)
            .put("/api/comentarios/9999")
            .send({
                content: "Este es un contenido actualizado que tiene más de 20 caracteres."
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe("Comentario no encontrado");
    });

    test("rechaza actualización con content menor a 20 caracteres", async () => {
        const response = await request(app)
            .put("/api/comentarios/1")
            .send({
                content: "Corto"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain("al menos 20 caracteres");
    });
});

// DELETE /api/comentarios/:id
describe("DELETE /api/comentarios/:id", () => {
    test("devuelve 404 si el comentario no existe", async () => {
        const response = await request(app).delete("/api/comentarios/9999");

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe("Comentario no encontrado");
    });
});

// GET /api/comentarios/publicacion/:publicacionId
describe("GET /api/comentarios/publicacion/:publicacionId", () => {
    test("devuelve lista vacía si la publicación no tiene comentarios", async () => {
        const response = await request(app).get("/api/comentarios/publicacion/9999");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});