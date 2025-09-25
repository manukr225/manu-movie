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

  movies.forEach((movie, index) => {
    const card = document.createElement('div');
    card.className = 'card';

    if (movie.format === 'iframe') {
      card.innerHTML = `
        <a href="movie.html?id=${movie.id}">
          <img src="${movie.poster}" alt="${movie.title}">
          <div class="card-title">${movie.title}</div>
        </a>
        <iframe
          src="${movie.embed}"
          width="320"
          height="180"
          frameborder="0"
          allowfullscreen
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        ></iframe>
      `;
    } else if (movie.format === 'videojs') {
      card.innerHTML = `
        <a href="movie.html?id=${movie.id}">
          <img src="${movie.poster}" alt="${movie.title}">
          <div class="card-title">${movie.title}</div>
        </a>
        <video id="video-${index}" controls width="320" height="180"></video>
      `;
    } else {
      card.innerHTML = `
        <a href="movie.html?id=${movie.id}">
          <img src="${movie.poster}" alt="${movie.title}">
          <div class="card-title">${movie.title}</div>
        </a>
      `;
    }

    grid.appendChild(card);

    if (movie.format === 'videojs') {
      var video = document.getElementById(`video-${index}`);
      if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(movie.embed);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {});
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = movie.embed;
      }
    }
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
