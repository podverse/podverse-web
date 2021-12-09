type Props = {
  label: string
  onClick?: any
}

export const ButtonLink = ({ label, onClick }: Props) => {
  return (
    <button className='button-link' onClick={onClick}>
      {label}
    </button>
  )
}
