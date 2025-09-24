document.getElementById('movieForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const movie = {
    id: document.getElementById('id').value.trim(),
    title: document.getElementById('title').value.trim(),
    poster: document.getElementById('poster').value.trim(),
    category: document.getElementById('category').value.trim(),
    embed: document.getElementById('embed').value.trim()
  };
  document.getElementById('output').textContent = JSON.stringify(movie, null, 2);
});
