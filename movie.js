const params = new URLSearchParams(window.location.search);
const movieId = params.get('id');

fetch('data/movies.json')
  .then(res => res.json())
  .then(movies => {
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return document.body.innerHTML = "<h2>Movie not found</h2>";

    document.getElementById('movieTitle').textContent = movie.title;
    document.getElementById('moviePoster').src = movie.poster;

    const embedContainer = document.getElementById('movieEmbed');

    if (movie.format === "iframe") {
      embedContainer.outerHTML = `<iframe src="${movie.embed}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;
    }

    else if (movie.format === "hls") {
      embedContainer.outerHTML = `
        <video id="video" controls width="100%" height="600"></video>
        <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
        <script>
          const video = document.getElementById('video');
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource("${movie.embed}");
            hls.attachMedia(video);
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = "${movie.embed}";
          }
        </script>
      `;
    }

    else if (movie.format === "flv") {
      embedContainer.outerHTML = `
        <video id="videoElement" controls width="100%" height="600"></video>
        <script src="https://cdn.jsdelivr.net/npm/flv.js@latest"></script>
        <script>
          if (flvjs.isSupported()) {
            const player = flvjs.createPlayer({
              type: 'flv',
              url: "${movie.embed}"
            });
            player.attachMediaElement(document.getElementById('videoElement'));
            player.load();
            player.play();
          }
        </script>
      `;
    }
