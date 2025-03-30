// Pobieranie danych z localStorage (jeśli istnieją)
let artists = JSON.parse(localStorage.getItem("artists")) || [];
let songs = JSON.parse(localStorage.getItem("songs")) || [];

// Funkcja zapisująca dane do localStorage
function saveToLocalStorage() {
    localStorage.setItem("artists", JSON.stringify(artists));
    localStorage.setItem("songs", JSON.stringify(songs));
}

// Funkcja do odświeżenia listy artystów
function updateArtists() {
    let artistList = document.getElementById("artist-list");
    if (!artistList) return;
    artistList.innerHTML = "";

    artists.forEach(artist => {
        let li = document.createElement("li");
        let link = document.createElement("a");
        link.href = "#";
        link.textContent = artist.name;
        link.addEventListener("click", () => openArtistProfile(artist));
        li.appendChild(link);
        artistList.appendChild(li);
    });
}

// Funkcja do odświeżenia Global 100
function updateRanking() {
    let rankingList = document.getElementById("global-ranking");
    if (!rankingList) return;
    rankingList.innerHTML = "";

    let rankings = [...songs].sort((a, b) => b.totalStreams - a.totalStreams).slice(0, 10);

    rankings.forEach((song, index) => {
        let li = document.createElement("li");
        li.textContent = `#${index + 1} - ${song.title} (${song.artist}) - 🔥 ${song.totalStreams.toLocaleString()} odtworzeń`;
        rankingList.appendChild(li);
    });
}

// Funkcja do otwierania profilu artysty
function openArtistProfile(artist) {
    let modal = document.getElementById("artist-profile-modal");
    let modalTitle = document.getElementById("artist-profile-name");
    let songList = document.getElementById("artist-songs-list");
    let highestRanking = document.getElementById("artist-highest-ranking");

    modal.style.display = "block";
    modalTitle.textContent = artist.name;

    songList.innerHTML = "";
    let artistSongs = songs.filter(song => song.artist === artist.name);
    artistSongs.forEach(song => {
        let li = document.createElement("li");
        li.textContent = `${song.title} - 🔥 ${song.totalStreams.toLocaleString()} odtworzeń`;
        songList.appendChild(li);
    });

    // Znalezienie najwyższej pozycji piosenki artysty w Global 100
    let highestRank = songs
        .filter(song => song.artist === artist.name)
        .map(song => {
            return songs.findIndex(s => s === song) + 1;
        })
        .sort((a, b) => a - b)[0];

    highestRanking.textContent = `Najwyższa pozycja na Global 100: #${highestRank || "Brak"}`;

    // Zamknięcie okna modalnego
    document.querySelector(".close-btn").addEventListener("click", function () {
        modal.style.display = "none";
    });
}

// Funkcja do dodawania artysty
document.getElementById("add-artist-form").addEventListener("submit", function (e) {
    e.preventDefault();
    let artistName = document.getElementById("artist-name").value;

    artists.push({ name: artistName });
    saveToLocalStorage();
    updateArtists();
    alert(`Dodano artystę: ${artistName}`);
    document.getElementById("add-artist-form").reset();
});

// Funkcja do dodawania piosenki
document.getElementById("add-song-form").addEventListener("submit", function (e) {
    e.preventDefault();
    let songTitle = document.getElementById("song-title").value;
    let songArtist = document.getElementById("song-artist").value;

    let songData = {
        title: songTitle,
        artist: songArtist,
        totalStreams: Math.floor(Math.random() * 10000000),
    };

    songs.push(songData);
    saveToLocalStorage();
    updateRanking(); // Odśwież ranking piosenek
    alert(`Dodano piosenkę: ${songTitle}`);
    document.getElementById("add-song-form").reset();
});

// Funkcja do aktualizacji odtworzeń co 2 minuty (120000 ms)
setInterval(() => {
    songs.forEach(song => {
        // Dodawanie do odtworzeń, ale max do 10 000 000
        song.totalStreams = Math.min(song.totalStreams + Math.floor(Math.random() * 10000000), 10000000);
        saveToLocalStorage();
        updateRanking();  // Odśwież ranking
    });
}, 120000);  // 120000 ms = 2 minuty

// Zaktualizowanie listy po załadowaniu strony
document.addEventListener("DOMContentLoaded", () => {
    updateArtists();
    updateRanking();
});
