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
    )
  }

  MusicPlayer.css = style
  MusicPlayer.afterDOMLoaded = script

  return MusicPlayer
}) satisfies QuartzComponentConstructor<Options>
