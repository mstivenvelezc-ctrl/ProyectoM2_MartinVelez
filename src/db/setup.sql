
CREATE TABLE Usuarios (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE Publicaciones (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  usuario_id INTEGER NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
);
41

INSERT INTO Usuarios (name, email, bio) VALUES
  ('Ana García', 'ana@example.com', 'Desarrolladora full-stack apasionada por Node.js'),
  ('Carlos Ruiz', 'carlos@example.com', 'Escritor técnico especializado en bases de datos'),
  ('María López', 'maria@example.com', 'Ingeniera de software con foco en APIs REST');

INSERT INTO Publicaciones (title, content, usuario_id, published) VALUES
  ('Introducción a Node.js', 'Node.js es un runtime de JavaScript...', 1, true),
  ('PostgreSQL vs MySQL', 'Ambas bases de datos tienen ventajas...', 2, true),
  ('APIs RESTful', 'REST es un estilo arquitectónico...', 1, true),
  ('Manejo de errores en Express', 'El manejo apropiado de errores...', 3, false),
  ('Async/Await explicado', 'Las promesas simplifican el código asíncrono...', 1, false);