type Props = {
  body?: string
  children?: any
  email: string
  subject?: string
}

export const MailTo = ({ body = '', children, email, subject = '' }: Props) => {
  let params = subject || body ? '?' : ''
  if (subject) params += `subject=${encodeURIComponent(subject)}`
  if (body) params += `${subject ? '&' : ''}body=${encodeURIComponent(body)}`

  return (
    <a className='mail-to' href={`mailto:${email}${params}`}>
      {children}
    </a>
  )
}
