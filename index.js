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
    function onPlay(playing) {
        // do something
    }

    console.log(activePlayerInstances);
    console.log(activePlayerInstancesByVideoCode);

    const videoCode = target.getAttribute('data-video');
    var ytPlayer;
    const { CUED, ENDED, BUFFERING, PLAYING } = getPlayerStates(YT);

    if (activePlayerInstances.includes(videoCode)) {
        // No crear instancia, esto significa que este player ya fue creado
        ytPlayer = activePlayerInstancesByVideoCode[videoCode];
    } else {
        const player = document.createElement('div');
        player.setAttribute('id', `youtube-player-${videoCode}`);
        target.appendChild(player);

        const { video: videoId, autoplay, loop } = target.dataset;

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
                    onPlay(ytPlayer.getPlayerState() !== CUED);
                },
                onStateChange: (event) => {
                    event.data === ENDED ? onPlay(false) : null;
                },
            },
        });

        activePlayerInstances.push(videoCode);
        activePlayerInstancesByVideoCode[videoCode] = ytPlayer;
    }

    console.log(ytPlayer);

    ytPlayer.getPlayerState() === PLAYING ||
    ytPlayer.getPlayerState() === BUFFERING
        ? (ytPlayer.pauseVideo(), onPlay(false))
        : (ytPlayer.playVideo(), onPlay(true));
}

// The Youtube IFrame Player API calls this function
// after its successfully loaded
function onYouTubeIframeAPIReady() {
    const activePlayerInstances = [];
    const activePlayerInstancesByVideoCode = {};

    addClickListeners(activePlayerInstances, activePlayerInstancesByVideoCode);
}

// Al hacer click se debe crear recién el player para ese elemento en puntual y asociarle logica
// de detención y play
function addClickListeners(
    activePlayerInstances,
    activePlayerInstancesByVideoCode,
) {
    const playableElements = document.querySelectorAll('#youtube-audio');
    playableElements.forEach((element) =>
        element.addEventListener('click', ({ target }) =>
            createPlayer(
                target,
                activePlayerInstances,
                activePlayerInstancesByVideoCode,
            ),
        ),
    );
}
