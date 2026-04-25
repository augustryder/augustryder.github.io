import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "August Herron",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "google",
      tagId: "G-BX2SWN09GW",
    },
    locale: "en-US",
    baseUrl: "augustherron.com",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        title: "UnifrakturMaguntia",
        header: "Cormorant Garamond",
        body: "EB Garamond",
        code: "MedievalSharp",
      },
      colors: {
        lightMode: {
          light: "#f9f4dc",
          lightgray: "#d9d8cd",
          gray: "#878787",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#7991a4",
          tertiary: "#b4d4cf",
          highlight: "rgba(110, 148, 178, 0.15)",
          textHighlight: "#e8b58988",
        },
        darkMode: {
          light: "#141415",
          lightgray: "#252530",
          gray: "#606079",
          darkgray: "#cdcdcd",
          dark: "#cdcdcd",
          secondary: "#9daad3",
          tertiary: "#b4d4cf",
          highlight: "rgba(51, 55, 56, 0.5)",
          textHighlight: "#e8b58988",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "one-light",
          dark: "nord",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
