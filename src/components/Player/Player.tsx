import {useOmniAural} from "omniaural"
import classnames from "classnames"

type Props = {
}

export const Player = ({}: Props) => {
  const [player] = useOmniAural("player")

  const className = classnames(
      "player",
      !!player.show ? "" : "display-none"
  )
  
  return (
    <div className={className}>
      {"Hello World"}
    </div>
  )
}
