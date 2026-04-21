
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE publicaciones (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  usuario_id INTEGER NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE comentarios (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200),
  content TEXT NOT NULL,
  publicacion_id INTEGER NOT NULL,
  usuarios_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
  FOREIGN KEY (usuarios_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

INSERT INTO usuarios (name, email, bio) VALUES
  ('Ana García', 'ana@example.com', 'Desarrolladora full-stack apasionada por Node.js'),
  ('Carlos Ruiz', 'carlos@example.com', 'Escritor técnico especializado en bases de datos'),
  ('María López', 'maria@example.com', 'Ingeniera de software con foco en APIs REST');

INSERT INTO publicaciones (title, content, usuario_id, published) VALUES
  ('Introducción a Node.js', 'Node.js es un runtime de JavaScript...', 1, true),
  ('PostgreSQL vs MySQL', 'Ambas bases de datos tienen ventajas...', 2, true),
  ('APIs RESTful', 'REST es un estilo arquitectónico...', 1, true),
  ('Manejo de errores en Express', 'El manejo apropiado de errores...', 3, false),
  ('Async/Await explicado', 'Las promesas simplifican el código asíncrono...', 1, false);

INSERT INTO comentarios (title, content, publicacion_id, usuarios_id) VALUES
  ('Gran artículo', 'Me gustó mucho la explicación sobre Node.js', 1, 1),
  ('Muy útil', 'La comparación entre PostgreSQL y MySQL fue muy clara', 2, 2),
  ('Excelente guía', 'La sección sobre APIs RESTful fue muy informativa', 3, 1),
  ('Esperando publicación', 'Estoy ansioso por leer el artículo sobre manejo de errores', 4, 3);