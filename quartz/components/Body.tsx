import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Body: QuartzComponent = ({ children, fileData }: QuartzComponentProps) => {
  // `dropcap` frontmatter: "false" disables the drop cap, a letter overrides it (see custom.inline.ts)
  const dropcap = fileData.frontmatter?.dropcap as string | undefined
  return (
    <div id="quartz-body" data-dropcap={dropcap || undefined}>
      {children}
    </div>
  )
}

export default (() => Body) satisfies QuartzComponentConstructor
