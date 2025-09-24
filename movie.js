const params = new URLSearchParams(window.location.search);
const movieId = params.get('id');

fetch('data/movies.json')
  .then(res => res.json())
  .then(movies => {
    const movie = movies.find(m => m.id === movieId);
    if (movie) {
      document.getElementById('movieTitle').textContent = movie.title;
      document.getElementById('moviePoster').src = movie.poster;
      document.getElementById('moviePoster').alt = movie.title;
      document.getElementById('movieEmbed').src = movie.embed;
    } else {
      document.body.innerHTML = "<h2>Movie not found</h2>";
    }
  });
