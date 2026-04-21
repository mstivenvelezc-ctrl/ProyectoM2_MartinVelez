import { describe, test, expect } from "vitest";
import { validarTitle, validarContent, validarPublicacionId, validarUsuariosId, validarPublished } from '../src/utils/validatorsC.js';

// Pruebas para validarTitle
describe('validarTitle', () => {
  test('acepta título válido', () => {
    expect(validarTitle('Título de prueba')).toBe(null);
  });
  test('rechaza título vacío', () => {
    expect(validarTitle('')).toContain('requerido');
  });
  test('rechaza título con menos de 5 caracteres', () => {
    expect(validarTitle('Abc')).toContain('entre 5 y 200 caracteres');
  });
  test('rechaza título con más de 200 caracteres', () => {
    const longTitle = 'A'.repeat(201);
    expect(validarTitle(longTitle)).toContain('entre 5 y 200 caracteres');
  });
  test('rechaza título null', () => {
    expect(validarTitle(null)).toContain('requerido');
  });
  test('rechaza título undefined', () => {
    expect(validarTitle(undefined)).toContain('requerido');
  });
});

// Pruebas para validarContent
describe('validarContent', () => {
  test('acepta contenido válido', () => {
    expect(validarContent('Este es un contenido de prueba que tiene más de 20 caracteres.')).toBe(null);
  });
  test('rechaza contenido con menos de 20 caracteres', () => {
    expect(validarContent('Contenido corto')).toContain('al menos 20 caracteres');
  });
  test('rechaza contenido null', () => {
    expect(validarContent(null)).toContain('requerido');
  });
  test('rechaza contenido undefined', () => {
    expect(validarContent(undefined)).toContain('requerido');
  });
});

// Pruebas para validarPublicacionId
describe('validarPublicacionId', () => {
  test('acepta publicacion_id válido', () => {
    expect(validarPublicacionId(1)).toBe(null);
  });
  test('rechaza publicacion_id null', () => {
    expect(validarPublicacionId(null)).toContain('requerido');
  });
  test('rechaza publicacion_id undefined', () => {
    expect(validarPublicacionId(undefined)).toContain('requerido');
  });
});

// Pruebas para validarUsuariosId
describe('validarUsuariosId', () => {
  test('acepta usuarios_id válido', () => {
    expect(validarUsuariosId(1)).toBe(null);
  });
  test('rechaza usuarios_id null', () => {
    expect(validarUsuariosId(null)).toContain('requerido');
  });
  test('rechaza usuarios_id undefined', () => {
    expect(validarUsuariosId(undefined)).toContain('requerido');
  });
});

