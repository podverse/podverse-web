import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPlus,
  faCut,
  faShare,
  faExpandAlt,
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons"
import classnames from "classnames"

type Props = {
  className?: string
  onClick?: any
  size: "small" | "medium" | "large"
  type: "speed" | "add" | "clip" | "share" | "fullscreen" | "mute" | "unmute"
  children?: any
}

export const PlayerOptionButton = ({
  className,
  onClick,
  size,
  type,
  children,
}: Props) => {
  const wrapperClass = classnames(className, "player-option-button", size)
  let icon = null
  switch (type) {
    case "speed":
      icon = null
      break
    case "add":
      icon = faPlus
      break
    case "clip":
      icon = faCut
      break
    case "share":
      icon = faShare
      break
    case "fullscreen":
      icon = faExpandAlt
      break
    case "mute":
      icon = faVolumeMute
      break
    case "unmute":
      icon = faVolumeUp
      break
    default:
      break
  }

  return (
    <button className={wrapperClass} onClick={onClick}>
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </button>
  )
}
