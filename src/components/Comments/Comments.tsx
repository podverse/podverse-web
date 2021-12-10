import moment from 'moment'
import { useTranslation } from 'react-i18next'
import type { PVComment } from '~/services/socialInteraction/PVComment'
import { MainContentSection, PVImage } from '..'

type Props = {
  comment: PVComment
}

export const Comments = ({ comment }: Props) => {
  const { t } = useTranslation()

  const commentNodes = generateCommentNodes(comment)

  return (
    <div className='comments'>
      <MainContentSection headerText={t('Comments')}>{commentNodes}</MainContentSection>
      <hr />
    </div>
  )
}

const generateCommentNodes = (comment: PVComment) => {
  if (!comment) return null
  const replyNodes = []

  const { replies } = comment
  for (const reply of replies) {
    replyNodes.push(generateCommentNodes(reply))
  }

  return <Comment comment={comment}>{replyNodes}</Comment>
}

type CommentProps = {
  children: any
  comment: PVComment
}

const Comment = ({ children, comment }: CommentProps) => {
  const { content, imageUrl, isRoot, published, url, username } = comment

  return (
    <div className='comment'>
      <a className='inner-wrapper' href={url} rel='noreferrer' target='_blank'>
        <div className='username'>{username}</div>
        <div className='content'>{content}</div>
        <div className='published'>{moment(published).format('MMM Do YYYY, h:mm:ss a')}</div>
        {isRoot && imageUrl && (
          <div className='image-wrapper'>
            <PVImage src={imageUrl} width='100%' />
          </div>
        )}
      </a>
      {children.length ? <div className='replies'>{children}</div> : null}
    </div>
  )
}
