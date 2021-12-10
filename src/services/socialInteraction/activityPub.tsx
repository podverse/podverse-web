import type { PVComment } from './PVComment'
import { request } from '../request'
import striptags from 'striptags'
import { decodeHtml } from '~/lib/utility/misc'

type Attachment = {
  mediaType: string
  url: string
}

type ActivityPubNote = {
  attachment: Attachment[] | null
  attributedTo: string | null
  content: string | null
  id: string
  inReplyToAtomUri: string | null
  published: Date | null
  replies: {
    first: {
      next: string | null
    }
  }
  url: string | null
}

type ActivityPubCollectionPage = {
  items: ActivityPubNote[]
}

export const getActivityPubNote = async (url: string) => {
  const response = await request({
    url,
    headers: {
      Accept: 'application/activity+json'
    }
  })

  const { data } = response
  let comment = null
  if (data) {
    comment = convertActivityPubNoteToPVComment(data)
  }

  return comment
}

export const getActivityPubCollection = async (nextUrl: string) => {
  const response = await request({
    url: nextUrl,
    headers: {
      Accept: 'application/activity+json'
    }
  })

  const { data } = response
  let comments = null
  if (data) {
    comments = convertActivityPubCollectionPageToPVComments(data)
  }

  return comments
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

const getAttachmentImage = (attachments: Attachment[]) => {
  return attachments.find((attachment: Attachment) => attachment?.mediaType?.indexOf('image') === 0)
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
