import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faRedoAlt,
  faUndoAlt,
} from "@fortawesome/free-solid-svg-icons"
import classnames from "classnames"

type Props = {
  className?: string
  direction: "forwards" | "backwards"
  onClick?: any
  size: "small" | "medium" | "large"
  type: "jump" | "mini-jump" | "skip"
}

export const PlayerControlButton = ({
  type,
  direction,
  onClick,
  size,
}: Props) => {
  let jumpTime = 0
  let icon = null
  if (type === "skip") {
    if (direction === "backwards") {
      icon = faAngleDoubleLeft
    } else if (direction === "forwards") {
      icon = faAngleDoubleRight
    }
  } else if (type == "jump") {
    if (direction === "backwards") {
      icon = faUndoAlt
      jumpTime = 10
    } else if (direction === "forwards") {
      icon = faRedoAlt
      jumpTime = 30
    }
  } else if (type == "mini-jump") {
    if (direction === "backwards") {
      icon = faUndoAlt
      jumpTime = 1
    } else if (direction === "forwards") {
      icon = faRedoAlt
      jumpTime = 1
    }
  }

  const wrapperClass = classnames("player-progress-button", size)
  const buttonContainerClass = classnames("jump-time-text-container", direction)
  const buttonTextClass = classnames("jump-time-text", direction)

  return (
    <button className={wrapperClass} onClick={onClick}>
      <FontAwesomeIcon icon={icon} />
      <div className={buttonContainerClass}>
        {type === "jump" && <div className={buttonTextClass}>{jumpTime}</div>}
        {type === "mini-jump" && <div className={buttonTextClass}>{1}</div>}
      </div>
    </button>
  )
}
