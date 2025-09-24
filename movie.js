const params = new URLSearchParams(window.location.search);
const movieId = params.get('id');

fetch('data/movies.json')
  .then(res => res.json())
  .then(movies => {
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return document.body.innerHTML = "<h2>Movie not found</h2>";

    document.getElementById('movieTitle').textContent = movie.title;
    document.getElementById('moviePoster').src = movie.poster;

    const container = document.getElementById('videoContainer');
    container.innerHTML = ''; // reset

    // For iframe embed
    if (movie.format === "iframe") {
      container.innerHTML = `<iframe src="${movie.embed}" width="100%" height="900" frameborder="0" allowfullscreen></iframe>`;
    }

    // For HLS/m3u8 embed
    else if (movie.format === "hls") {
      container.innerHTML = `<video id="moviePlayer" controls width="100%" height="600"></video>`;
      const video = document.getElementById('moviePlayer');
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
      script.onload = () => {
        if (window.Hls && Hls.isSupported()) {
          var hls = new Hls();
          hls.loadSource(movie.embed);
          hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = movie.embed;
        } else {
          video.outerHTML = "<div>Sorry, this video cannot play in your browser.</div>";
        }
      };
      document.body.appendChild(script);
    }

    // For Video.js embed
    else if (movie.format === "videojs") {
      container.innerHTML = `
        <link href="https://vjs.zencdn.net/8.10.0/video-js.css" rel="stylesheet" />
        <video id="my-video" class="video-js vjs-default-skin" controls preload="auto" width="100%" height="600">
          <source src="${movie.embed}" type="application/x-mpegURL">
          Your browser does not support the video tag.
        </video>
        <script src="https://vjs.zencdn.net/8.10.0/video.min.js"></script>
      `;
      setTimeout(() => {
        if (window.videojs) videojs(document.getElementById('my-video'));
      }, 1000);
    }

    // For FLV
    else if (movie.format === "flv") {
      container.innerHTML = `<video id="videoElement" controls width="100%" height="600"></video>`;
      const video = document.getElementById('videoElement');
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/flv.js@latest";
      script.onload = () => {
        if (window.flvjs && flvjs.isSupported()) {
          const player = flvjs.createPlayer({
            type: 'flv',
            url: movie.embed
          });
          player.attachMediaElement(video);
          player.load();
          player.play();
        } else {
          video.outerHTML = "<div>Sorry, this FLV video cannot play.</div>";
        }
      };
      document.body.appendChild(script);
    }

    else {
      container.innerHTML = `<p>Unsupported format: ${movie.format}</p>`;
    }
  });
