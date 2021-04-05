/* 
 YouTube Audio Embed 
 --------------------
 
 Original Author: Amit Agarwal
 Web: http://www.labnol.org/?p=26740 
 Original source code: https://cdn.rawgit.com/labnol/files/master/yt.js

 Refactored by: Facundo Alexandre
 Github: github.com/facualex

 The original code was refactored with cleaner code and modified for the purpose of having multiple
 player sources
*/

function getPlayerStates(YoutubeAPIInstance) {
    if (!YoutubeAPIInstance) {
        return null;
    }

    return {
        BUFFERING: YoutubeAPIInstance.PlayerState.BUFFERING,
        PLAYING: YoutubeAPIInstance.PlayerState.PLAYING,
        ENDED: YoutubeAPIInstance.PlayerState.ENDED,
        CUED: YoutubeAPIInstance.PlayerState.CUED,
    };
}

function createPlayer(
    target,
    activePlayerInstances,
    activePlayerInstancesByVideoCode,
) {
    const { CUED, ENDED, BUFFERING, PLAYING } = getPlayerStates(YT);
    var ytPlayer;
    var parentButton;

    if (target.id === 'youtube-audio') {
        parentButton = target;
    } else {
        parentButton = target.parentElement;
    }

    const videoCode = parentButton.getAttribute('data-video');
    const stateIcon = parentButton.querySelector('#state-icon');
    const playerStateText = parentButton.querySelector('#player-state');

    function onPlay(playerState) {
        if (playerState === PLAYING) {
            playerStateText.innerText = 'Pausar';
            stateIcon.src = 'resources/pause-solid.svg';
        } else if (playerState === ENDED) {
            playerStateText.innerText = 'Reproducir';
            stateIcon.src = 'resources/play-solid.svg';
        } else if ([BUFFERING, CUED].includes(playerState)) {
            playerStateText.innerText = 'Cargando...';
            stateIcon.src = 'resources/pause-solid.svg';
        }
    }

    if (activePlayerInstances.includes(videoCode)) {
        ytPlayer = activePlayerInstancesByVideoCode[videoCode];
    } else {
        const player = document.createElement('div');
        player.setAttribute('id', `youtube-player-${videoCode}`);
        parentButton.appendChild(player);

        const { video: videoId, autoplay, loop } = parentButton.dataset;

        ytPlayer = new YT.Player(`youtube-player-${videoCode}`, {
            height: '0',
            width: '0',
            videoId,
            playerVars: {
                autoplay,
                loop,
            },
            events: {
                onReady: () => {
                    ytPlayer.setPlaybackQuality('small');
                    ytPlayer.playVideo();
                    onPlay(ytPlayer.getPlayerState());
                },
                onStateChange: (event) => {
                    event.data ? onPlay(event.data) : null;
                },
            },
        });

        activePlayerInstances.push(videoCode);
        activePlayerInstancesByVideoCode[videoCode] = ytPlayer;
    }

    ytPlayer.getPlayerState() === PLAYING ||
    ytPlayer.getPlayerState() === BUFFERING
        ? (ytPlayer.pauseVideo(), onPlay(ENDED))
        : (ytPlayer.playVideo(), onPlay(PLAYING));
}

// The Youtube IFrame Player API calls this function
// after its successfully loaded
function onYouTubeIframeAPIReady() {
    // Structures that keep track of the created player instances
    const activePlayerInstances = [];
    const activePlayerInstancesByVideoCode = {};

    addClickListeners(activePlayerInstances, activePlayerInstancesByVideoCode);
}

function addClickListeners(
    activePlayerInstances,
    activePlayerInstancesByVideoCode,
) {
    const playableElements = document.querySelectorAll('#youtube-audio');

    playableElements.forEach((element) => {
        // Create and append button and image
        const stateIcon = document.createElement('img');
        stateIcon.src = 'resources/play-solid.svg';
        stateIcon.classList.add('state-icon');
        stateIcon.id = 'state-icon';
        element.appendChild(stateIcon);

        const stateText = document.createElement('span');
        stateText.innerText = 'Reproducir';
        stateText.id = 'player-state';
        element.appendChild(stateText);

        element.addEventListener('click', ({ target }) =>
            createPlayer(
                target,
                activePlayerInstances,
                activePlayerInstancesByVideoCode,
            ),
        );
    });
}
