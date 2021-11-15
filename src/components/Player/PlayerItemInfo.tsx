import classnames from "classnames"

type Props = {
  imgSource: string | null,
  podcastTitle: string | null,
  mediaTitle: string | null
}

export const PlayerItemInfo = ({}: Props) => {

  const container = classnames(
    "item-info-container"
)

  return (
    <div className={container}>
      <img/>
      <div>

      </div>
    </div>
  )
}
