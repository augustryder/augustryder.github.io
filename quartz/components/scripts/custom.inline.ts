// Site-specific client scripts (ported from the v4 customizations).
// Loaded on every page via quartz/plugins/emitters/componentResources.ts.

// ---- Drop caps ----
const DROPCAP_COLORS = [
  "red",
  "maroon",
  "orange",
  "gold",
  "green",
  "teal",
  "sky",
  "blue",
  "purple",
  "lavender",
  "pink",
]

// Probability of getting a colored dropcap (vs default gray)
const COLOR_PROBABILITY = 0.067

// Roll once on page load and remember the result
let chosenColor: string | null = null
let colorRolled = false

function rollDropcapColor(): string | null {
  if (!colorRolled) {
    colorRolled = true
    if (Math.random() < COLOR_PROBABILITY) {
      chosenColor = DROPCAP_COLORS[Math.floor(Math.random() * DROPCAP_COLORS.length)]
    }
  }
  return chosenColor
}

function setupDropcap() {
  // Set data-first-letter on the first paragraph of each article
  // so the CSS ::before pseudo-element can render the background letter
  const override = document.getElementById("quartz-body")?.getAttribute("data-dropcap") ?? null
  const articles = document.querySelectorAll("article")
  for (const article of articles) {
    const firstP = article.querySelector("p:first-of-type")
    if (firstP && firstP.textContent) {
      if (override === "false") continue
      const firstLetter = override || firstP.textContent.trim().charAt(0)
      if (firstLetter && /[a-zA-Z]/.test(firstLetter)) {
        firstP.setAttribute("data-first-letter", firstLetter.toUpperCase())
      }
    }
  }

  // Apply the dropcap color (rolled once, constant across navigations)
  const color = rollDropcapColor()
  if (color) {
    document.documentElement.style.setProperty("--random-dropcap-color", `var(--dropcap-${color})`)
  } else {
    document.documentElement.style.removeProperty("--random-dropcap-color")
  }
}

document.addEventListener("nav", setupDropcap)

// ---- Active table-of-contents entry ----
// Track which headings are currently in the top portion of the viewport
// to highlight the "active" TOC entry (not just visible ones)
let currentActiveSlug: string | null = null

function updateActiveTocEntry() {
  const headers = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")
  const viewportThreshold = window.innerHeight * 0.3

  let activeHeader: Element | null = null
  for (const header of headers) {
    const rect = header.getBoundingClientRect()
    if (rect.top <= viewportThreshold) {
      activeHeader = header
    } else {
      break
    }
  }

  const newSlug = activeHeader?.id ?? null

  if (newSlug !== currentActiveSlug) {
    // Remove previous active
    if (currentActiveSlug) {
      const prev = document.querySelectorAll(`a[data-for="${currentActiveSlug}"]`)
      prev.forEach((el) => el.classList.remove("active"))
    }

    // Add new active
    if (newSlug) {
      const next = document.querySelectorAll(`a[data-for="${newSlug}"]`)
      next.forEach((el) => el.classList.add("active"))
    }

    currentActiveSlug = newSlug
  }
}

document.addEventListener("nav", () => {
  currentActiveSlug = null
  updateActiveTocEntry()
  const onScroll = () => updateActiveTocEntry()
  window.addEventListener("scroll", onScroll, { passive: true })
  window.addCleanup(() => window.removeEventListener("scroll", onScroll))
})
