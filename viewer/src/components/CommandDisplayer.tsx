import { SFC } from "react"

const CommandDisplayer: SFC<{ commands: string[] }> = ({ commands }) => (
  <div>
    <pre dangerouslySetInnerHTML={{ __html: commands.join("\n") }} />
    <style jsx>{`
      pre {
        height: 13em;
        width: 80ex;
        padding: 0.5em;
        background: #eeeeee;
        color: black;
      }
    `}</style>
  </div>
)

export default CommandDisplayer
