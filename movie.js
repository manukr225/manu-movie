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
      embedContainer.src = movie.embed;
    }

    else if (movie.format === "hls") {
      const video = document.createElement('video');
      video.id = "video";
      video.controls = true;
      video.width = "100%";
      video.height = 600;
      embedContainer.replaceWith(video);

      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
      script.onload = () => {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(movie.embed);
          hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = movie.embed;
        }
      };
      document.body.appendChild(script);
    }

    else if (movie.format === "flv") {
      const video = document.createElement('video');
      video.id = "videoElement";
      video.controls = true;
      video.width = "100%";
      video.height = 600;
      embedContainer.replaceWith(video);

      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/flv.js@latest";
      script.onload = () => {
        if (flvjs.isSupported()) {
          const player = flvjs.createPlayer({
            type: 'flv',
            url: movie.embed
          });
          player.attachMediaElement(video);
          player.load();
          player.play();
        }
      };
      document.body.appendChild(script);
    }

    else {
      embedContainer.outerHTML = `<p>Unsupported format: ${movie.format}</p>`;
    }
  });
