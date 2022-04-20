import { ButtonRectangle } from '~/components'

type Props = {
  actionLabel?: string
  actionOnClick?: any
  message: string
}

export const MessageWithAction = ({ actionLabel, actionOnClick, message }: Props) => {
  return (
    <div className='message-with-action'>
      <div className='message' tabIndex={0}>
        {message}
      </div>
      {actionLabel && actionOnClick && <ButtonRectangle label={actionLabel} onClick={actionOnClick} type='primary' />}
    </div>
  )
}
