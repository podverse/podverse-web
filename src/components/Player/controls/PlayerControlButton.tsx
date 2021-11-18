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
  type: "jump" | "skip"
}

export const PlayerControlButton = ({
  type,
  direction,
  onClick,
  size,
}: Props) => {
  let jumpTime = 10
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
    } else if (direction === "forwards") {
      icon = faRedoAlt
      jumpTime = 30
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
      </div>
    </button>
  )
}
