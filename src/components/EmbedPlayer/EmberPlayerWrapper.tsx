import { EmbedPlayerFooter } from './EmbedPlayerFooter'

type Props = {
  children: any
}

export const EmbedPlayerWrapper = ({ children }: Props) => {
  return (
    <div className='embed-player'>
      <div className='embed-player-wrapper'>
        <div className='embed-player-wrapper-top'>{children}</div>
      </div>
      <EmbedPlayerFooter />
    </div>
  )
}
