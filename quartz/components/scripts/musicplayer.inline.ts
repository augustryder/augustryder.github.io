import { registerEscapeHandler } from "./util"

// Persistent audio state that survives SPA navigation
interface MusicPlayerState {
  audio: HTMLAudioElement
  audioCtx: AudioContext | null
  analyser: AnalyserNode | null
  tracks: { name: string; artist?: string; src: string }[]
  currentTrackIndex: number
}

const _mp: { state: MusicPlayerState | null } = ((window as any).__musicPlayer ??= { state: null })

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function ensureAnalyser(state: MusicPlayerState): AnalyserNode | null {
  if (state.analyser) return state.analyser
  try {
    const ctx = new AudioContext()
    const source = ctx.createMediaElementSource(state.audio)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 256
    source.connect(analyser)
    analyser.connect(ctx.destination)
    state.audioCtx = ctx
    state.analyser = analyser
    return analyser
  } catch {
    return null
  }
}

function drawVisualizer(
  canvas: HTMLCanvasElement,
  analyser: AnalyserNode | null,
  isPlaying: boolean,
  isExpanded: boolean,
) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const w = rect.width
  const h = rect.height

  ctx.clearRect(0, 0, w, h)

  const styles = getComputedStyle(document.documentElement)
  const secondary = styles.getPropertyValue("--secondary").trim()
  const tertiary = styles.getPropertyValue("--tertiary").trim()
  const gray = styles.getPropertyValue("--gray").trim()

  if (!analyser || !isPlaying) {
    // Draw idle state: flat line
    ctx.beginPath()
    ctx.strokeStyle = gray
    ctx.lineWidth = 1
    const barCount = isExpanded ? 64 : 32
    const barWidth = w / barCount
    for (let i = 0; i < barCount; i++) {
      const x = i * barWidth + barWidth / 2
      ctx.moveTo(x, h / 2 - 1)
      ctx.lineTo(x, h / 2 + 1)
    }
    ctx.stroke()
    return
  }

  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  analyser.getByteFrequencyData(dataArray)

  const barCount = isExpanded ? 64 : 32
  const barWidth = w / barCount
  const gap = Math.max(1, barWidth * 0.2)

  for (let i = 0; i < barCount; i++) {
    // Map bar index to frequency bin (use lower frequencies more)
    const binIndex = Math.floor((i / barCount) * bufferLength * 0.8)
    const value = dataArray[binIndex] / 255

    const barHeight = Math.max(2, value * h * 0.85)
    const x = i * barWidth + gap / 2
    const y = (h - barHeight) / 2

    // Gradient from secondary to tertiary based on frequency
    const t = i / barCount
    ctx.fillStyle = t < 0.5 ? secondary : tertiary
    ctx.globalAlpha = 0.6 + value * 0.4
    ctx.fillRect(x, y, barWidth - gap, barHeight)
  }
  ctx.globalAlpha = 1
}

// Sync all controls within a given container to current audio state
function syncControls(
  container: HTMLElement,
  state: MusicPlayerState,
  isExpandedView: boolean,
) {
  const track = state.tracks[state.currentTrackIndex]
  const { audio } = state

  const nameEl = container.querySelector<HTMLElement>(".music-player-track-name")
  const artistEl = container.querySelector<HTMLElement>(".music-player-track-artist")
  const playBtn = container.querySelector<HTMLButtonElement>(".music-player-play")
  const prevBtn = container.querySelector<HTMLButtonElement>(".music-player-prev")
  const nextBtn = container.querySelector<HTMLButtonElement>(".music-player-next")
  const barFill = container.querySelector<HTMLElement>(".music-player-bar-fill")
  const currentTimeEl = container.querySelector<HTMLElement>(".music-player-time.current")
  const durationEl = container.querySelector<HTMLElement>(".music-player-time.duration")

  if (nameEl) nameEl.textContent = track.name
  if (artistEl) artistEl.textContent = track.artist ?? ""

  if (audio.duration) {
    if (durationEl) durationEl.textContent = formatTime(audio.duration)
    if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime)
    if (barFill) barFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`
  }

  if (state.tracks.length <= 1) {
    if (prevBtn) prevBtn.style.display = "none"
    if (nextBtn) nextBtn.style.display = "none"
  }
}

function bindControls(
  container: HTMLElement,
  state: MusicPlayerState,
  playerRoot: HTMLElement,
) {
  const { audio } = state
  const playBtn = container.querySelector<HTMLButtonElement>(".music-player-play")!
  const prevBtn = container.querySelector<HTMLButtonElement>(".music-player-prev")!
  const nextBtn = container.querySelector<HTMLButtonElement>(".music-player-next")!
  const bar = container.querySelector<HTMLElement>(".music-player-bar")!

  function updateAllTrackInfo() {
    const track = state.tracks[state.currentTrackIndex]
    playerRoot.querySelectorAll<HTMLElement>(".music-player-track-name").forEach(
      (el) => (el.textContent = track.name),
    )
    playerRoot.querySelectorAll<HTMLElement>(".music-player-track-artist").forEach(
      (el) => (el.textContent = track.artist ?? ""),
    )
    playerRoot.querySelectorAll<HTMLElement>(".music-player-bar-fill").forEach(
      (el) => (el.style.width = "0%"),
    )
    playerRoot.querySelectorAll<HTMLElement>(".music-player-time.current").forEach(
      (el) => (el.textContent = "0:00"),
    )
    playerRoot.querySelectorAll<HTMLElement>(".music-player-time.duration").forEach(
      (el) => (el.textContent = "0:00"),
    )
  }

  function loadTrack(index: number) {
    state.currentTrackIndex = index
    audio.src = state.tracks[index].src
    updateAllTrackInfo()
  }

  function togglePlay() {
    ensureAnalyser(state)
    if (state.audioCtx?.state === "suspended") {
      state.audioCtx.resume()
    }
    if (audio.paused) {
      audio.play()
      playerRoot.classList.add("playing")
    } else {
      audio.pause()
      playerRoot.classList.remove("playing")
    }
  }

  function onPrev() {
    loadTrack((state.currentTrackIndex - 1 + state.tracks.length) % state.tracks.length)
    ensureAnalyser(state)
    audio.play()
    playerRoot.classList.add("playing")
  }

  function onNext() {
    loadTrack((state.currentTrackIndex + 1) % state.tracks.length)
    ensureAnalyser(state)
    audio.play()
    playerRoot.classList.add("playing")
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

  return () => {
    playBtn.removeEventListener("click", togglePlay)
    prevBtn.removeEventListener("click", onPrev)
    nextBtn.removeEventListener("click", onNext)
    bar.removeEventListener("click", onBarClick)
  }
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
      audioCtx: null,
      analyser: null,
      tracks,
      currentTrackIndex: 0,
    }
    _mp.state.audio.src = tracks[0].src
  }

  const state = _mp.state
  const { audio } = state

  // Sync playing state
  if (!audio.paused) {
    player.classList.add("playing")
  }

  // --- Widget (compact) view ---
  const widgetContainer = player.querySelector<HTMLElement>(".music-player-outer")!
  syncControls(widgetContainer, state, false)
  const cleanupWidget = bindControls(widgetContainer, state, player)

  // --- Expanded view ---
  const expandedOuter = player.querySelector<HTMLElement>(".music-player-expanded-outer")!
  const expandedContainer = player.querySelector<HTMLElement>(".music-player-expanded-container")!
  syncControls(expandedContainer, state, true)
  const cleanupExpanded = bindControls(expandedContainer, state, player)

  // Expand / collapse
  const expandBtn = player.querySelector<HTMLButtonElement>(".music-player-expand-icon")!

  function showExpanded() {
    expandedOuter.classList.add("active")
    const sidebar = expandedOuter.closest(".sidebar") as HTMLElement
    if (sidebar) sidebar.style.zIndex = "1"
    registerEscapeHandler(expandedOuter, hideExpanded)
  }

  function hideExpanded() {
    expandedOuter.classList.remove("active")
    const sidebar = expandedOuter.closest(".sidebar") as HTMLElement
    if (sidebar) sidebar.style.zIndex = ""
  }

  expandBtn.addEventListener("click", showExpanded)

  // --- Visualizer animation loop ---
  const widgetCanvas = player.querySelector<HTMLCanvasElement>(".music-player-visualizer")!
  const expandedCanvas = player.querySelector<HTMLCanvasElement>(".music-player-visualizer-expanded")!

  let animating = true
  function animateVisualizer() {
    if (!animating) return
    const isPlaying = !audio.paused
    drawVisualizer(widgetCanvas, state.analyser, isPlaying, false)
    if (expandedOuter.classList.contains("active")) {
      drawVisualizer(expandedCanvas, state.analyser, isPlaying, true)
    }
    requestAnimationFrame(animateVisualizer)
  }
  requestAnimationFrame(animateVisualizer)

  // --- Persistent audio event handlers (bound once) ---
  if (!(audio as any).__mpBound) {
    ;(audio as any).__mpBound = true

    audio.addEventListener("timeupdate", () => {
      const p = document.querySelector<HTMLElement>(".music-player")
      if (!p) return
      p.querySelectorAll<HTMLElement>(".music-player-bar-fill").forEach((el) => {
        if (audio.duration) el.style.width = `${(audio.currentTime / audio.duration) * 100}%`
      })
      p.querySelectorAll<HTMLElement>(".music-player-time.current").forEach((el) => {
        el.textContent = formatTime(audio.currentTime)
      })
    })

    audio.addEventListener("loadedmetadata", () => {
      const p = document.querySelector<HTMLElement>(".music-player")
      if (!p) return
      p.querySelectorAll<HTMLElement>(".music-player-time.duration").forEach((el) => {
        el.textContent = formatTime(audio.duration)
      })
    })

    audio.addEventListener("ended", () => {
      if (state.tracks.length > 1) {
        state.currentTrackIndex = (state.currentTrackIndex + 1) % state.tracks.length
        const track = state.tracks[state.currentTrackIndex]
        audio.src = track.src
        audio.play()
        const p = document.querySelector<HTMLElement>(".music-player")
        if (p) {
          p.querySelectorAll<HTMLElement>(".music-player-track-name").forEach(
            (el) => (el.textContent = track.name),
          )
          p.querySelectorAll<HTMLElement>(".music-player-track-artist").forEach(
            (el) => (el.textContent = track.artist ?? ""),
          )
        }
      } else {
        const p = document.querySelector<HTMLElement>(".music-player")
        if (p) {
          p.classList.remove("playing")
          p.querySelectorAll<HTMLElement>(".music-player-bar-fill").forEach(
            (el) => (el.style.width = "0%"),
          )
          p.querySelectorAll<HTMLElement>(".music-player-time.current").forEach(
            (el) => (el.textContent = "0:00"),
          )
        }
      }
    })
  }

  // Cleanup UI bindings on nav, keep audio alive
  window.addCleanup(() => {
    animating = false
    cleanupWidget()
    cleanupExpanded()
    expandBtn.removeEventListener("click", showExpanded)
    hideExpanded()
  })
})
