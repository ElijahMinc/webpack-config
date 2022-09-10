import React from "react"
import ReactDOM from "react-dom"
import styles from "./styles/index.module.css"
import twitterSVG from "./static/twitter.svg"
import ukr from "./static/ukr.webp"

const App = () => {
  return <div>Helllo</div>
}

const About: React.FC<{ className: string }> = ({ className }) => {
  return (
    <div className={className}>
      <img src={ukr} />
    </div>
  )
}

const root = document.getElementById("root")

ReactDOM.render(<About className={styles["someclass"]} />, root)
