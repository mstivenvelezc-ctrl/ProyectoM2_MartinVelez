// usuarios tests
import { describe, test, expect } from "vitest";
import { validarEmail, validarName, validarBio} from '../back/src/utils/validatorsU.js';

// Pruebas para validarEmail
describe('validarEmail', () => {
  test('acepta email válido', () => {
    expect(validarEmail('test@example.com')).toBe(null);
  });
  test('rechaza email sin @', () => {
    expect(validarEmail('testexample.com')).toContain('no es válido');
  });
  test('rechaza email sin dominio', () => {
    expect(validarEmail('test@')).toContain('no es válido');
  });
  test('rechaza email vacío', () => {
    expect(validarEmail('')).toContain('requerido');
  });
  test('rechaza email null', () => {
    expect(validarEmail(null)).toContain('requerido');
  });
});


// Pruebas para validateName"test:ui": "vitest --ui"
describe('validarName', () => {
  test('acepta nombre válido', () => {
    expect(validarName('Juan')).toBe(null);
    });
    test('rechaza nombre vacío', () => {
    expect(validarName('')).toContain('el nombre debe tener al menos 2 caracteres');
    });
    test('rechaza nombre con menos de 2 caracteres', () => {
    expect(validarName('A')).toContain('el nombre debe tener al menos 2 caracteres');
    });
    test('rechaza nombre con más de 100 caracteres', () => {
    const longName = 'A'.repeat(101);
    expect(validarName(longName)).toContain('el nombre no puede tener más de 100 caracteres');
    });
    test('rechaza nombre null', () => {
    expect(validarName(null)).toContain('el nombre es requerido');
    });
    test('rechaza nombre undefined', () => {
    expect(validarName(undefined)).toContain('el nombre es requerido');
    });
});

// Pruebas para validarBio
describe('validarBio', () => {
  test('acepta biografía válida', () => {
    expect(validarBio('Esta es una biografía válida.')).toBe(null);
  });
    test('acepta biografía undefined (campo opcional)', () => {
    expect(validarBio(undefined)).toBe(null);
    });
    test('rechaza biografía con menos de 10 caracteres', () => {
    expect(validarBio('Corta')).toContain('al menos 10 caracteres');
    });
    test('rechaza biografía con más de 200 caracteres', () => {
    const longBio = 'A'.repeat(201);
    expect(validarBio(longBio)).toContain('no más de 200');
    });
});
