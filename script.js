function renderMovies(movies) {
  const grid = document.getElementById('movieGrid');
  grid.innerHTML = '';

  movies.forEach((movie, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    let videoSection = '';

    // HLS STREAM CARD
    if (movie.format === 'videojs') {
      videoSection = `<video id="video-${index}" controls width="320" height="180"></video>`;
    }
    // IFRAME EMBED CARD
    else if (movie.format === 'iframe') {
      videoSection = `<iframe src="${movie.embed}" width="320" height="180" frameborder="0"
      allowfullscreen sandbox="allow-same-origin allow-scripts allow-popups"></iframe>`;
    }

    card.innerHTML = `
      <a href="movie.html?id=${movie.id}">
        <img src="${movie.poster}" alt="${movie.title}">
        <div class="card-title">${movie.title}</div>
      </a>
      ${videoSection}
    `;
    grid.appendChild(card);

    // Only run hls.js for HLS videos
    if (movie.format === 'videojs') {
      var video = document.getElementById(`video-${index}`);
      if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(movie.embed);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = movie.embed;
      }
    }
  });
}
