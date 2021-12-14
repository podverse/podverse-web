import type { ActivityPubAttachment, ActivityPubNote, ActivityPubCollectionPage, PVComment } from 'podverse-shared'
import striptags from 'striptags'
import { decodeHtml } from '~/lib/utility/misc'
import { PV } from '~/resources'
import { request } from '~/services/request'

export const getEpisodeProxyActivityPub = async (episodeId: string) => {
  const response = await request({
    endpoint: `${PV.RoutePaths.api.episode}/${episodeId}/proxy/activity-pub`,
    method: 'get'
  })
  const { replies, rootComment } = response.data
  const comment = convertActivityPubNoteToPVComment(rootComment)
  comment.isRoot = true
  const replyComments = convertActivityPubCollectionPageToPVComments(replies)
  comment.replies = replyComments
  return comment
}

const parseUserName = (attributedTo: string) => {
  let username = ''
  const url = new URL(attributedTo)
  const hostname = url.hostname
  const segments = url.pathname.split('/')
  const last = segments.pop() || segments.pop() // Handle potential trailing slash

  if (hostname && last) {
    username = `${last}@${hostname}`
  }

  return username
}

const getAttachmentImage = (attachments: ActivityPubAttachment[]) => {
  return attachments.find((attachment: ActivityPubAttachment) => attachment?.mediaType?.indexOf('image') === 0)
}

const convertActivityPubNoteToPVComment = (note: ActivityPubNote) => {
  const { attachment, attributedTo, content, id, published, replies, url } = note
  const { next } = replies.first
  const cleanedContent = decodeHtml(striptags(content))
  const attachmentImage = getAttachmentImage(attachment)
  const username = parseUserName(attributedTo)

  const pvComment: PVComment = {
    content: cleanedContent,
    id,
    imageUrl: attachmentImage?.url || null,
    published,
    replies: [], // insert the replies later when available
    repliesFirstNext: next,
    url,
    username
  }

  return pvComment
}

const convertActivityPubCollectionPageToPVComments = (collectionPage: ActivityPubCollectionPage) => {
  const notes = collectionPage.items
  const comments = notes.map((note: ActivityPubNote) => convertActivityPubNoteToPVComment(note))
  return comments
}
