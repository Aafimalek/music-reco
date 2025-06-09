function toggleMode() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

window.onload = function () {
    // Load stored theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        document.getElementById('modeToggle').checked = true;
    }

    // Load song list
    fetch('/songs')
        .then(res => res.json())
        .then(data => {
            const datalist = document.getElementById('songList');
            data.forEach(song => {
                const option = document.createElement('option');
                option.value = song;
                datalist.appendChild(option);
            });
        });

    // Handle form submission
    document.getElementById('recommendForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const songName = document.getElementById('song').value;
        const recommendationsDiv = document.getElementById('recommendations');
        const loader = document.getElementById('loader');
        const clearButton = document.getElementById('clearButton');
        
        recommendationsDiv.innerHTML = '';
        loader.style.display = 'block';
        clearButton.style.display = 'none';

        fetch('/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ song: songName })
        })
            .then(res => res.json())
            .then(data => {
                loader.style.display = 'none';
                if (data.error) {
                    recommendationsDiv.innerHTML = `<div class="error-message">🚫 ${data.error}</div>`;
                } else {
                    // Create beautiful recommendation cards
                    const recommendationsHtml = Object.entries(data).map(([index, item]) => `
                        <div class="recommendation-card">
                            <div class="recommendation-item">
                                <div class="song-number">${index}</div>
                                <div class="recommendation-content">
                                    <div class="song-title">🎵 ${item.song}</div>
                                    <div class="artist-name">👤 ${item.artist}</div>
                                </div>
                            </div>
                        </div>
                    `).join('');
                    
                    recommendationsDiv.innerHTML = `
                        <h2>🎶 Recommended Songs for "${songName}"</h2>
                        ${recommendationsHtml}
                    `;
                }
                clearButton.style.display = 'block';
            })
            .catch(error => {
                loader.style.display = 'none';
                recommendationsDiv.innerHTML = `<div class="error-message">❌ An error occurred: ${error.message}</div>`;
                clearButton.style.display = 'block';
            });
    });

    // Handle clear button
    document.getElementById('clearButton').addEventListener('click', function() {
        const recommendationsDiv = document.getElementById('recommendations');
        const clearButton = document.getElementById('clearButton');
        const songInput = document.getElementById('song');
        
        recommendationsDiv.innerHTML = '';
        clearButton.style.display = 'none';
        songInput.value = '';
        songInput.focus();
    });
};
