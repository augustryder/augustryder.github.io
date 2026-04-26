// Persistent audio state that survives SPA navigation
interface MusicPlayerState {
  audio: HTMLAudioElement
  tracks: { name: string; artist?: string; src: string }[]
  currentTrackIndex: number
}

const _mp: { state: MusicPlayerState | null } = (window as any).__musicPlayer ??= { state: null }

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

document.addEventListener("nav", () => {
  const player = document.querySelector<HTMLElement>(".music-player")
  if (!player) return

  const tracksData = player.dataset.tracks
  if (!tracksData) return

  const tracks: { name: string; artist?: string; src: string }[] = JSON.parse(tracksData)
  if (tracks.length === 0) return

  // Initialize persistent state on first load
  if (!_mp.state) {
    _mp.state = {
      audio: new Audio(),
      tracks,
      currentTrackIndex: 0,
    }
    _mp.state.audio.src = tracks[0].src
  }

  const { audio } = _mp.state
  const state = _mp.state

  // Grab fresh DOM references (these change after micromorph)
  const trackName = player.querySelector<HTMLElement>(".music-player-track-name")!
  const trackArtist = player.querySelector<HTMLElement>(".music-player-track-artist")!
  const playBtn = player.querySelector<HTMLButtonElement>(".music-player-play")!
  const prevBtn = player.querySelector<HTMLButtonElement>(".music-player-prev")!
  const nextBtn = player.querySelector<HTMLButtonElement>(".music-player-next")!
  const barFill = player.querySelector<HTMLElement>(".music-player-bar-fill")!
  const bar = player.querySelector<HTMLElement>(".music-player-bar")!
  const currentTimeEl = player.querySelector<HTMLElement>(".music-player-time.current")!
  const durationEl = player.querySelector<HTMLElement>(".music-player-time.duration")!

  // Sync UI to current persistent state
  const currentTrack = state.tracks[state.currentTrackIndex]
  trackName.textContent = currentTrack.name
  trackArtist.textContent = currentTrack.artist ?? ""

  if (!audio.paused) {
    player.classList.add("playing")
  }

  if (audio.duration) {
    durationEl.textContent = formatTime(audio.duration)
    currentTimeEl.textContent = formatTime(audio.currentTime)
    barFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`
  }

  if (state.tracks.length <= 1) {
    prevBtn.style.display = "none"
    nextBtn.style.display = "none"
  }

  // --- UI event handlers (re-bound each nav, cleaned up on next nav) ---

  function loadTrack(index: number) {
    state.currentTrackIndex = index
    const track = state.tracks[state.currentTrackIndex]
    audio.src = track.src
    trackName.textContent = track.name
    trackArtist.textContent = track.artist ?? ""
    barFill.style.width = "0%"
    currentTimeEl.textContent = "0:00"
    durationEl.textContent = "0:00"
  }

  function togglePlay() {
    if (audio.paused) {
      audio.play()
      player.classList.add("playing")
    } else {
      audio.pause()
      player.classList.remove("playing")
    }
  }

  function onPrev() {
    loadTrack((state.currentTrackIndex - 1 + state.tracks.length) % state.tracks.length)
    audio.play()
    player.classList.add("playing")
  }

  function onNext() {
    loadTrack((state.currentTrackIndex + 1) % state.tracks.length)
    audio.play()
    player.classList.add("playing")
  }

  function onBarClick(e: MouseEvent) {
    const rect = bar.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    if (audio.duration) {
      audio.currentTime = pct * audio.duration
    }
  }

  playBtn.addEventListener("click", togglePlay)
  prevBtn.addEventListener("click", onPrev)
  nextBtn.addEventListener("click", onNext)
  bar.addEventListener("click", onBarClick)

  // --- Audio event handlers (persistent, only bound once) ---
  // Remove any previous listeners by replacing with fresh ones via a flag
  if (!(audio as any).__mpBound) {
    ;(audio as any).__mpBound = true

    audio.addEventListener("timeupdate", () => {
      // Always update the *current* DOM elements via fresh query
      const p = document.querySelector<HTMLElement>(".music-player")
      if (!p) return
      const fill = p.querySelector<HTMLElement>(".music-player-bar-fill")
      const ct = p.querySelector<HTMLElement>(".music-player-time.current")
      if (audio.duration && fill && ct) {
        fill.style.width = `${(audio.currentTime / audio.duration) * 100}%`
        ct.textContent = formatTime(audio.currentTime)
      }
    })

    audio.addEventListener("loadedmetadata", () => {
      const p = document.querySelector<HTMLElement>(".music-player")
      if (!p) return
      const dur = p.querySelector<HTMLElement>(".music-player-time.duration")
      if (dur) dur.textContent = formatTime(audio.duration)
    })

    audio.addEventListener("ended", () => {
      if (state.tracks.length > 1) {
        state.currentTrackIndex = (state.currentTrackIndex + 1) % state.tracks.length
        const track = state.tracks[state.currentTrackIndex]
        audio.src = track.src
        audio.play()
        // Update current DOM
        const p = document.querySelector<HTMLElement>(".music-player")
        if (p) {
          const tn = p.querySelector<HTMLElement>(".music-player-track-name")
          const ta = p.querySelector<HTMLElement>(".music-player-track-artist")
          if (tn) tn.textContent = track.name
          if (ta) ta.textContent = track.artist ?? ""
        }
      } else {
        const p = document.querySelector<HTMLElement>(".music-player")
        if (p) {
          p.classList.remove("playing")
          const fill = p.querySelector<HTMLElement>(".music-player-bar-fill")
          const ct = p.querySelector<HTMLElement>(".music-player-time.current")
          if (fill) fill.style.width = "0%"
          if (ct) ct.textContent = "0:00"
        }
      }
    })
  }

  // Only clean up UI event listeners on nav, never touch the audio
  window.addCleanup(() => {
    playBtn.removeEventListener("click", togglePlay)
    prevBtn.removeEventListener("click", onPrev)
    nextBtn.removeEventListener("click", onNext)
    bar.removeEventListener("click", onBarClick)
  })
})
