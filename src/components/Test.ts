interface IUser {
  id: number
  name: string
}

export class User {
  user: Partial<IUser> = {}

  constructor() {}

  static async render() {
    // using static method, async/await - Promises
    console.log("start")

    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve("end")
      }, 3000)
    })
  }
}
