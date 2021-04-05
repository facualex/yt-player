/* 
 YouTube Audio Embed 
 --------------------
 
 Original Author: Amit Agarwal
 Web: http://www.labnol.org/?p=26740 
 Original source code: https://cdn.rawgit.com/labnol/files/master/yt.js

 Refactored by: Facundo Alexandre
 Github: github.com/facualex
*/

function getPlayerStates(YoutubeAPIInstance) {
    return {
        BUFFERING: YoutubeAPIInstance.PlayerState.BUFFERING,
        PLAYING: YoutubeAPIInstance.PlayerState.PLAYING,
        ENDED: YoutubeAPIInstance.PlayerState.ENDED,
        CUED: YoutubeAPIInstance.PlayerState.CUED,
    };
}

function createPlayers(htmlPlayableElements) {
    function onPlay(playing, playIcon) {
        // do something
    }

    htmlPlayableElements.forEach((element, index) => {
        const player = document.createElement('div');
        player.setAttribute('id', `youtube-player-${index}`);
        element.appendChild(player);

        const ytPlayer = new YT.Player(`youtube-player-${index}`, {
            height: '0',
            width: '0',
            videoId: element.dataset.video,
            playerVars: {
                autoplay: element.dataset.autoplay,
                loop: element.dataset.loop,
            },
            events: {
                onReady: () => {
                    ytPlayer.setPlaybackQuality('small');
                    onPlay(ytPlayer.getPlayerState() !== playerStates.CUED);
                },
                onStateChange: (event) => {
                    event.data === playerStates.ENDED && onPlay(false);
                },
            },
        });

        element.onclick = () => {
            ytPlayer.getPlayerState() === playerStates.PLAYING ||
            ytPlayer.getPlayerState() === playerStates.BUFFERING
                ? (ytPlayer.pauseVideo(), onPlay(false))
                : (ytPlayer.playVideo(), onPlay(true));
        };
    });
}

function createPlayer(target) {
    const videoCode = target.getAttribute('data-video');

    const { CUED, ENDED, BUFFERING, PLAYING } = getPlayerStates(YT);

    function onPlay(playing, playIcon) {
        // do something
    }

    const player = document.createElement('div');
    player.setAttribute('id', `youtube-player-${videoCode}`);
    target.appendChild(player);

    const ytPlayer = new YT.Player(`youtube-player-${videoCode}`, {
        height: '0',
        width: '0',
        videoId: target.dataset.video,
        playerVars: {
            autoplay: target.dataset.autoplay,
            loop: target.dataset.loop,
        },
        events: {
            onReady: () => {
                ytPlayer.setPlaybackQuality('small');
                onPlay(ytPlayer.getPlayerState() !== CUED);
            },
            onStateChange: (event) => {
                event.data === ENDED && onPlay(false);
            },
        },
    });

    ytPlayer.getPlayerState() === PLAYING ||
    ytPlayer.getPlayerState() === BUFFERING
        ? (ytPlayer.pauseVideo(), onPlay(false))
        : (ytPlayer.playVideo(), onPlay(true));
}

// The Youtube IFrame Player API calls this function
// after its successfully loaded
function onYouTubeIframeAPIReady() {
    addClickListeners();

    //const playableElements = document.querySelectorAll('#youtube-audio');
    //createPlayers(playableElements);
}

// Al hacer click se debe crear recién el player para ese elemento en puntual y asociarle logica
// de detención y play
function addClickListeners() {
    const playableElements = document.querySelectorAll('#youtube-audio');
    playableElements.forEach((element) => {
        element.addEventListener('click', ({ target }) => createPlayer(target));
    });
}
