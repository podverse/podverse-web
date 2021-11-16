import classnames from "classnames"

type Props = {
}

export const PlayerItemButtons = ({}: Props) => {
  
  const container = classnames("player-buttons-container")
  return (
    <div className={container}>
      {"Buttons"}
    </div>
  )
}
