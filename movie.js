const params = new URLSearchParams(window.location.search);
const movieId = params.get('id');

fetch('data/movies.json')
  .then(res => res.json())
  .then(movies => {
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return document.body.innerHTML = "<h2>Movie not found</h2>";

    document.getElementById('movieTitle').textContent = movie.title;
    document.getElementById('moviePoster').src = movie.poster;

    const embedContainer = document.getElementById('videoContainer');

    if (movie.format === "iframe") {
      document.getElementById('movieEmbed').src = movie.embed;
    } else if (movie.format === "hls") {
      embedContainer.innerHTML = `
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
    } else if (movie.format === "flv") {
      embedContainer.innerHTML = `
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
    } else {
      embedContainer.innerHTML = `<p>Unsupported format: ${movie.format}</p>`;
    }
  });
