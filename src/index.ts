import styles from "./styles/index.module.css"
import img from "./static/room-type-3.png"

import { User } from "@components/Test"

const root = document.getElementById("root") as HTMLDivElement

const user = new User()

User.render().then(console.log)


root.innerHTML = `
<img class="${styles.someclass}" src="${img}" />`
