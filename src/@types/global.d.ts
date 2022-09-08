declare module "*.module.css" {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames
  export = classNames
}

declare module "*.css" {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames
  export default classNames
}

declare module "*.png" {
  type IImgUrl = string

  const urlImg: IImgUrl

  export default urlImg
}
