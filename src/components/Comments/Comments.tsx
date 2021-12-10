import { useTranslation } from 'react-i18next'
import type { PVComment } from '~/services/socialInteraction/PVComment'
import { MainContentSection } from '..'

type Props = {
  comment: PVComment
  platform: string
}

export const Comments = ({ comment, platform }: Props) => {
  const { t } = useTranslation()

  const commentNodes = generateCommentNodes(comment)

  return (
    <div className='comments'>
      <MainContentSection headerText={t('Comments')}>
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
    <Comment comment={comment}>
      {replyNodes}
    </Comment>
  )
}

type CommentProps = {
  children: any
  comment: PVComment
}

const Comment = ({ children, comment }: CommentProps) => {
  const { content, imageUrl, published, url, username } = comment
  return (
    <div className='comment'>
      <div className='content'>{content}</div>
      <div className='image-wrapper'>{imageUrl}</div>
      <div className='published'>{published}</div>
      <div className='url'>{url}</div>
      <div className='username'>{username}</div>
      <div className='replies'>{children}</div>
    </div>
  )
}
