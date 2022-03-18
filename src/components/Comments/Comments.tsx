import type { PVComment } from 'podverse-shared'
import { useTranslation } from 'react-i18next'
import { readableDate } from '~/lib/utility/date'
import { MainContentSection, PVImage } from '..'

type Props = {
  comment: PVComment
  isLoading?: boolean
}

export const Comments = ({ comment, isLoading }: Props) => {
  const { t } = useTranslation()

  const commentNodes = generateCommentNodes(comment)

  return (
    <div className='comments'>
      <MainContentSection headerText={t('Comments')} isLoading={isLoading}>
        {commentNodes}
      </MainContentSection>
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

  return (
    <Comment comment={comment} key={comment.url}>
      {replyNodes}
    </Comment>
  )
}

type CommentProps = {
  children: any
  comment: PVComment
  showIcon: boolean
}

const Comment = ({ children, comment }: CommentProps) => {
  const { content, imageUrl, isRoot, profileIcon, published, url, username } = comment
  const withTime = true

  return (
    <div className='comment'>
      <div className='inner-comment-wrapper'>
        {
          profileIcon ?
            <div className='profile-icon'>
              <PVImage src={profileIcon} width='36' />
            </div>
          : null
        }
        <a className='inner-wrapper' href={url} rel='noreferrer' target='_blank'>
          <div className='username'>{username}</div>
          <div className='content'>{content}</div>
          <div className='published'>{readableDate(published, withTime)}</div>
          {isRoot && imageUrl && (
            <div className='image-wrapper'>
              <PVImage src={imageUrl} width='100%' />
            </div>
          )}
        </a>
      </div>
      {children.length ? <div className='replies'>{children}</div> : null}
    </div>
  )
}
