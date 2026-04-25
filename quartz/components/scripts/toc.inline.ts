// Track which headings are currently in the top portion of the viewport
// to highlight the "active" TOC entry (not just visible ones)
let currentActiveSlug: string | null = null

function updateActiveTocEntry() {
  const headers = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")
  const scrollY = window.scrollY
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

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const slug = entry.target.id
    const tocEntryElements = document.querySelectorAll(`a[data-for="${slug}"]`)
    const windowHeight = entry.rootBounds?.height
    if (windowHeight && tocEntryElements.length > 0) {
      if (entry.boundingClientRect.y < windowHeight) {
        tocEntryElements.forEach((tocEntryElement) => tocEntryElement.classList.add("in-view"))
      } else {
        tocEntryElements.forEach((tocEntryElement) => tocEntryElement.classList.remove("in-view"))
      }
    }
  }
})

function toggleToc(this: HTMLElement) {
  this.classList.toggle("collapsed")
  this.setAttribute(
    "aria-expanded",
    this.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )
  const content = this.nextElementSibling as HTMLElement | undefined
  if (!content) return
  content.classList.toggle("collapsed")
}

function setupToc() {
  for (const toc of document.getElementsByClassName("toc")) {
    const button = toc.querySelector(".toc-header")
    const content = toc.querySelector(".toc-content")
    if (!button || !content) return
    button.addEventListener("click", toggleToc)
    window.addCleanup(() => button.removeEventListener("click", toggleToc))
  }
}

document.addEventListener("nav", () => {
  setupToc()
  currentActiveSlug = null

  // update toc entry highlighting
  observer.disconnect()
  const headers = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")
  headers.forEach((header) => observer.observe(header))

  // Active heading tracking via scroll
  updateActiveTocEntry()
  const onScroll = () => updateActiveTocEntry()
  window.addEventListener("scroll", onScroll, { passive: true })
  window.addCleanup(() => window.removeEventListener("scroll", onScroll))
})
