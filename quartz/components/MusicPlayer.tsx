import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/musicplayer.inline"
import style from "./styles/musicplayer.scss"
import { classNames } from "../util/lang"

interface Track {
  name: string
  artist?: string
  src: string
}

interface Options {
  tracks: Track[]
}

export default ((opts: Options) => {
  const MusicPlayer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const tracks = opts.tracks ?? []
    return (
      <div class={classNames(displayClass, "music-player")} data-tracks={JSON.stringify(tracks)}>
        <div class="music-player-outer">
          <canvas class="music-player-visualizer" />
          <button class="music-player-expand-icon" aria-label="Expand visualizer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>
          <div class="music-player-info">
            <span class="music-player-track-name">No track loaded</span>
            <span class="music-player-track-artist"></span>
          </div>
          <div class="music-player-controls">
            <button class="music-player-prev" aria-label="Previous track">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
            <button class="music-player-play" aria-label="Play">
              <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              <svg class="pause-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>
            <button class="music-player-next" aria-label="Next track">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>
          <div class="music-player-progress">
            <span class="music-player-time current">0:00</span>
            <div class="music-player-bar">
              <div class="music-player-bar-fill"></div>
            </div>
            <span class="music-player-time duration">0:00</span>
          </div>
        </div>
        <div class="music-player-expanded-outer">
          <div class="music-player-expanded-container">
            <canvas class="music-player-visualizer-expanded" />
            <div class="music-player-expanded-info">
              <span class="music-player-track-name">No track loaded</span>
              <span class="music-player-track-artist"></span>
            </div>
            <div class="music-player-controls">
              <button class="music-player-prev" aria-label="Previous track">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>
              <button class="music-player-play" aria-label="Play">
                <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <svg class="pause-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              </button>
              <button class="music-player-next" aria-label="Next track">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            </div>
            <div class="music-player-progress">
              <span class="music-player-time current">0:00</span>
              <div class="music-player-bar">
                <div class="music-player-bar-fill"></div>
              </div>
              <span class="music-player-time duration">0:00</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  MusicPlayer.css = style
  MusicPlayer.afterDOMLoaded = script

  return MusicPlayer
}) satisfies QuartzComponentConstructor<Options>
