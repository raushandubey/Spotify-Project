// Spotify Clone Interactive Features

// DOM Elements
const playButtons = document.querySelectorAll('.play-button, .card-play-button');
const playPauseButton = document.querySelector('.play-pause-button');
const progressBar = document.querySelector('.progress-bar-fg');
const progressHandle = document.querySelector('.progress-handle');
const volumeBar = document.querySelector('.progress-bar-fg.volume');
const volumeHandle = document.querySelector('.progress-handle.volume');
const likeButton = document.querySelector('.like-button');
const shuffleButton = document.querySelector('.control-button.shuffle');
const repeatButton = document.querySelector('.control-button.repeat');
const searchIcon = document.querySelector('.search-icon');
const navLinks = document.querySelectorAll('.nav-option');
const filterPills = document.querySelectorAll('.filter-pill');

// Track Information
const currentTrack = {
    playing: false,
    progress: 0,
    volume: 0.7,
    liked: false,
    shuffle: false,
    repeat: false,
    duration: 225 // in seconds
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize progress and volume bars
    updateProgressBar(currentTrack.progress);
    updateVolumeBar(currentTrack.volume);
    
    // Add event listeners to all play buttons
    playButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = button.closest('.quick-access-item') || button.closest('.card');
            
            if (card) {
                // Get track details from the card
                const trackName = card.querySelector('span')?.textContent || 
                                   card.querySelector('.card-title')?.textContent || 
                                   'Unknown Track';
                const artistName = card.querySelector('.card-info')?.textContent || 'Unknown Artist';
                const imgSrc = card.querySelector('img')?.src || '';
                
                // Update player
                updateNowPlaying(trackName, artistName, imgSrc);
                togglePlay();
            }
        });
    });
    
    // Play/Pause button
    playPauseButton.addEventListener('click', togglePlay);
    
    // Progress bar interaction
    const progressContainer = document.querySelector('.progress-container');
    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const clickPosition = (e.clientX - rect.left) / rect.width;
        currentTrack.progress = clickPosition * currentTrack.duration;
        updateProgressBar(currentTrack.progress / currentTrack.duration);
        updateTimeDisplay(currentTrack.progress);
    });
    
    // Volume bar interaction
    const volumeContainer = document.querySelector('.progress-container.volume');
    volumeContainer.addEventListener('click', (e) => {
        const rect = volumeContainer.getBoundingClientRect();
        const clickPosition = (e.clientX - rect.left) / rect.width;
        currentTrack.volume = clickPosition;
        updateVolumeBar(currentTrack.volume);
    });
    
    // Like button
    likeButton.addEventListener('click', toggleLike);
    
    // Shuffle button
    if (shuffleButton) {
        shuffleButton.addEventListener('click', toggleShuffle);
    }
    
    // Repeat button
    if (repeatButton) {
        repeatButton.addEventListener('click', toggleRepeat);
    }
    
    // Search icon
    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            const searchNav = document.querySelector('.nav-option:nth-child(2)');
            if (searchNav) {
                activateNavOption(searchNav);
            }
        });
    }
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            activateNavOption(this);
        });
    });
    
    // Filter pills
    filterPills.forEach(pill => {
        pill.addEventListener('click', function() {
            filterPills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Add animation to cards
    animateCards();
});

// Functions
function togglePlay() {
    currentTrack.playing = !currentTrack.playing;
    
    // Toggle play/pause icon
    playPauseButton.innerHTML = currentTrack.playing ? 
        '<i class="fa-solid fa-pause"></i>' : 
        '<i class="fa-solid fa-play"></i>';
    
    if (currentTrack.playing) {
        // Start progress animation
        startProgressAnimation();
    } else {
        // Stop progress animation
        stopProgressAnimation();
    }
}

let progressInterval;

function startProgressAnimation() {
    // Clear any existing interval
    if (progressInterval) {
        clearInterval(progressInterval);
    }
    
    // Update progress every second
    progressInterval = setInterval(() => {
        currentTrack.progress += 1;
        
        // Reset if we reach the end
        if (currentTrack.progress >= currentTrack.duration) {
            if (currentTrack.repeat) {
                currentTrack.progress = 0;
            } else {
                currentTrack.progress = 0;
                togglePlay(); // stop playing
                return;
            }
        }
        
        updateProgressBar(currentTrack.progress / currentTrack.duration);
        updateTimeDisplay(currentTrack.progress);
    }, 1000);
}

function stopProgressAnimation() {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
}

function updateProgressBar(percentage) {
    progressBar.style.width = `${percentage * 100}%`;
    progressHandle.style.left = `${percentage * 100}%`;
}

function updateVolumeBar(volume) {
    const volumeProgress = document.querySelector('.progress-bar-fg.volume');
    const volumeHandle = document.querySelector('.progress-handle.volume');
    
    if (volumeProgress && volumeHandle) {
        volumeProgress.style.width = `${volume * 100}%`;
        volumeHandle.style.left = `${volume * 100}%`;
    }
}

function updateTimeDisplay(seconds) {
    const positionDisplay = document.querySelector('.playback-position');
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (positionDisplay) {
        positionDisplay.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

function updateNowPlaying(trackName, artistName, imgSrc) {
    const trackNameElement = document.querySelector('.track-name');
    const artistNameElement = document.querySelector('.artist-name');
    const albumImg = document.querySelector('.current-track-image img');
    
    if (trackNameElement) trackNameElement.textContent = trackName;
    if (artistNameElement) artistNameElement.textContent = artistName;
    if (albumImg && imgSrc) albumImg.src = imgSrc;
}

function toggleLike() {
    currentTrack.liked = !currentTrack.liked;
    
    // Toggle heart icon
    likeButton.innerHTML = currentTrack.liked ? 
        '<i class="fa-solid fa-heart"></i>' : 
        '<i class="fa-regular fa-heart"></i>';
    
    // Add animation
    likeButton.classList.add('pulse-animation');
    setTimeout(() => {
        likeButton.classList.remove('pulse-animation');
    }, 500);
}

function toggleShuffle() {
    currentTrack.shuffle = !currentTrack.shuffle;
    shuffleButton.classList.toggle('active', currentTrack.shuffle);
}

function toggleRepeat() {
    currentTrack.repeat = !currentTrack.repeat;
    repeatButton.classList.toggle('active', currentTrack.repeat);
}

function activateNavOption(navOption) {
    navLinks.forEach(link => link.classList.remove('active'));
    navOption.classList.add('active');
}

function animateCards() {
    const cards = document.querySelectorAll('.card');
    
    // Apply staggered animation to cards
    cards.forEach((card, index) => {
        // Add a delay based on the card's index
        const delay = index * 0.05;
        card.style.animation = `fadeInUp 0.5s ease ${delay}s backwards`;
    });
}

// Create responsive sidebar functionality
function setupResponsiveElements() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            document.body.classList.toggle('sidebar-collapsed');
        });
    }
    
    // Hide sidebar on small screens initially
    if (window.innerWidth < 768) {
        sidebar?.classList.add('collapsed');
        document.body.classList.add('sidebar-collapsed');
    }
    
    // Listen for window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth < 768) {
            sidebar?.classList.add('collapsed');
            document.body.classList.add('sidebar-collapsed');
        } else {
            sidebar?.classList.remove('collapsed');
            document.body.classList.remove('sidebar-collapsed');
        }
    });
}

// Call setup on load
window.addEventListener('load', setupResponsiveElements); 