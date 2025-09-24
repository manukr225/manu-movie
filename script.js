let allMovies = [];

fetch('data/movies.json')
  .then(res => res.json())
  .then(movies => {
    allMovies = movies;
    renderMovies(movies);
  });

function renderMovies(movies) {
  const grid = document.getElementById('movieGrid');
  grid.innerHTML = '';
  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <a href="movie.html?id=${movie.id}">
        <img src="${movie.poster}" alt="${movie.title}">
        <div class="card-title">${movie.title}</div>
      </a>
    `;
    grid.appendChild(card);
  });
}

document.getElementById('searchInput').addEventListener('input', filterMovies);
document.getElementById('categoryFilter').addEventListener('change', filterMovies);

function filterMovies() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const filtered = allMovies.filter(movie =>
    movie.title.toLowerCase().includes(query) &&
    (category === '' || movie.category === category)
  );
  renderMovies(filtered);
}
