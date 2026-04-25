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
  const articles = document.querySelectorAll("article")
  for (const article of articles) {
    const firstP = article.querySelector("p:first-of-type")
    if (firstP && firstP.textContent) {
      const override = article.getAttribute("data-dropcap")
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
    document.documentElement.style.setProperty(
      "--random-dropcap-color",
      `var(--dropcap-${color})`,
    )
  } else {
    document.documentElement.style.removeProperty("--random-dropcap-color")
  }
}

document.addEventListener("nav", setupDropcap)
