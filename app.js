
const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// Películas iniciales
let movies = [
  {
    id: 1,
    title: "CREED",
    description: "Un boxeador que busca construir su propio legado.",
    votes: 0
  },
  {
    id: 2,
    title: "Spider-Man",
    description: "Un joven héroe que lucha contra el crimen.",
    votes: 0
  },
  {
    id: 3,
    title: "Cars",
    description: "Rayo McQueen aprende sobre la amistad y las carreras.",
    votes: 0
  },
  {
    id: 4,
    title: "Avatar",
    description: "Una aventura en el planeta Pandora.",
    votes: 0
  }
];

// 1. Consultar todas las películas
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

// 2. Votar por una película
app.post("/vote/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "ID inválido."
    });
  }

  const movie = movies.find(movie => movie.id === id);

  if (!movie) {
    return res.status(404).json({
      message: "Película no encontrada."
    });
  }

  movie.votes++;

  res.status(200).json({
    message: "Voto registrado correctamente.",
    movie: movie
  });
});

// 3. Consultar una película por ID
app.get("/movie/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "ID inválido."
    });
  }

  const movie = movies.find(movie => movie.id === id);

  if (!movie) {
    return res.status(404).json({
      message: "Película no encontrada."
    });
  }

  res.status(200).json(movie);
});

// 4. Ver resultados ordenados por votos
app.get("/result", (req, res) => {
  const results = movies
    .map(movie => ({
      id: movie.id,
      title: movie.title,
      votes: movie.votes
    }))
    .sort((a, b) => b.votes - a.votes);

  res.status(200).json(results);
});

// 5. Agregar una película
app.post("/movies", (req, res) => {
  const { title, description } = req.body;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof description !== "string" ||
    !description.trim()
  ) {
    return res.status(400).json({
      message: "Ingresa un título y una descripción válidos."
    });
  }

  const newId = movies.length > 0
    ? Math.max(...movies.map(movie => movie.id)) + 1
    : 1;

  const newMovie = {
    id: newId,
    title: title.trim(),
    description: description.trim(),
    votes: 0
  };

  movies.push(newMovie);

  res.status(201).json({
    message: "Película agregada correctamente.",
    movie: newMovie
  });
});

// 6. Modificar una película
app.put("/movie/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, description } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "ID inválido."
    });
  }

  const movie = movies.find(movie => movie.id === id);

  if (!movie) {
    return res.status(404).json({
      message: "Película no encontrada."
    });
  }

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof description !== "string" ||
    !description.trim()
  ) {
    return res.status(400).json({
      message: "Ingresa un título y una descripción válidos."
    });
  }

  movie.title = title.trim();
  movie.description = description.trim();

  res.status(200).json({
    message: "Película modificada correctamente.",
    movie: movie
  });
});

// 7. Eliminar una película si no tiene votos
app.delete("/movie/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "ID inválido."
    });
  }

  const movie = movies.find(movie => movie.id === id);

  if (!movie) {
    return res.status(404).json({
      message: "Película no encontrada."
    });
  }

  if (movie.votes > 0) {
    return res.status(400).json({
      message: "No puedes eliminar una película que ya tiene votos."
    });
  }

  movies = movies.filter(movie => movie.id !== id);

  res.status(200).json({
    message: "Película eliminada correctamente."
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
