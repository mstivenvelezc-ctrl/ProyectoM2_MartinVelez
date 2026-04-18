// back/tests/app.test.js

import { describe, test, expect } from 'vitest';
import request from 'supertest';
import app from '../back/src/app.js';
import pool from '../back/src/db/config.js';


// Prueba para GET /api/usuarios
describe("GET /api/usuarios", () => {
    test("devuelve una lista de usuarios", async () => {
        const response = await request(app).get("/api/usuarios");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });
});

// Prueba para GET /api/usuarios/:id
describe("GET /api/usuarios/:id", () => {
    test("devuelve un usuario por ID", async () => {
        const response = await request(app).get("/api/usuarios/1");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("id", 1);
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("email");
    });
    

    test("devuelve 404 si el usuario no existe", async () => {
        const response = await request(app).get("/api/usuarios/9999");

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Usuario no encontrado");
    });
});

// Prueba para POST /api/usuarios
describe("POST /api/usuarios", () => {
    beforeEach(async () => {
        await pool.query("DELETE FROM usuarios WHERE email = 'prueba@example.com'");
    });
    afterEach(async () => {
        await pool.query("DELETE FROM usuarios WHERE email = 'prueba@example.com'");
    });
    test("crea un nuevo usuario", async () => {
        const response = await request(app)
        .post("/api/usuarios")
        .send({ name: "Usuario de Prueba", email: "prueba@example.com" });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("name", "Usuario de Prueba");
        expect(response.body).toHaveProperty("email", "prueba@example.com");
    });
});

// Prueba para POST /api/usuarios sin nombre
test("rechaza request sin nombre", async () => {
    const response = await request(app).post("/api/usuarios").send({ email: "prueba@example.com" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toContain("el nombre es requerido");
});

// Prueba para POST /api/usuarios con email inválido
test("rechaza email con formato ivalido", async () => {
    const response = (await request(app)
        .post("/api/usuarios")
        .send({ name: "Usuario de Prueba", email: "email-invalido" }));

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain("el email no es válido")
});

// Prueba para POST /api/usuarios con email duplicado
test("rechaza request vacio", async () =>{
    const response = await request(app).post("/api/usuarios").send({});

    expect(response.statusCode).toBe(400);
});


describe("DELETE /api/usuarios/:id", () => {
    test("devuelve 404 al eliminar usuario inexistente", async () => {
    const response = await request(app).delete("/api/usuarios/9999");

    expect(response.statusCode).toBe(404);
  });
});

describe("Rutas inexistentes",() => {
    test("devuelve 404 para ruta desconocida", async () => {
        const response = await request(app).get("/ruta-que-no-existe");

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("error");
    });
});