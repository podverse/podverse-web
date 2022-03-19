import {
  ThreadcapAttachment,
  ThreadcapNode,
  ThreadcapResponse,
  PVComment,
  ThreadcapCommenter,
  checkIfAllowedImageOrigin
} from 'podverse-shared'
import striptags from 'striptags'
import { decodeHtml } from '~/lib/utility/misc'
import { PV } from '~/resources'
import { request } from '~/services/request'

export const getEpisodeProxyActivityPub = async (episodeId: string) => {
  const response = await request({
    endpoint: `${PV.RoutePaths.api.episode}/${episodeId}/proxy/activity-pub`,
    method: 'get',
    opts: { timeout: 60000 }
  })

  const comment = convertThreadcapResponseToPVComment(response.data)
  comment.isRoot = true
  return comment
}

export const getEpisodeProxyTwitter = async (episodeId: string) => {
  const response = await request({
    endpoint: `${PV.RoutePaths.api.episode}/${episodeId}/proxy/twitter`,
    method: 'get',
    opts: { timeout: 60000 }
  })

  const comment = convertThreadcapResponseToPVComment(response.data)
  comment.isRoot = true
  return comment
}

const parseUserInfo = (comment: any, protocol: string, commenters: { [key: string]: ThreadcapCommenter }) => {
  let username = ''
  let profileIcon = ''
  const commenter = commenters[comment.attributedTo]

  if (protocol === 'activitypub' || protocol === 'mastodon') {
    const url = new URL(comment.attributedTo)
    const hostname = url.hostname
    const segments = url.pathname.split('/')
    const last = segments.pop() || segments.pop() // Handle potential trailing slash
    if (hostname && last) {
      username = `${last}@${hostname}`
    }

    const isAllowedImageOrigin = checkIfAllowedImageOrigin(commenter)
    if (isAllowedImageOrigin) {
      profileIcon = commenter.icon?.url || ''
    }
  } else if (protocol === 'twitter') {
    username = commenter.fqUsername
    profileIcon = commenter.icon?.url || ''
  }

  return { profileIcon, username }
}

const getAttachmentImage = (attachments: ThreadcapAttachment[]) => {
  return attachments.find((attachment: ThreadcapAttachment) => attachment?.mediaType?.indexOf('image') === 0)
}

const convertThreadcapResponseToPVComment = (response: ThreadcapResponse) => {
  const { commenters, nodes, protocol, roots } = response
  const root = roots[0]
  const rootNode = nodes[root]

  const generatePVComment = (node: ThreadcapNode, protocol: string) => {
    const { comment, replies } = node
    const { attachments, content, published, url } = comment

    const nestedReplies = Array.isArray(replies)
      ? replies.map((replyUrl: string) => {
          const nestedNode = nodes[replyUrl]
          let pvComment = null
          if (nestedNode && !nestedNode.commentError) {
            pvComment = generatePVComment(nestedNode, protocol)
          }
          return pvComment
        })
      : []

    const contentKeys = content && typeof content === 'object' ? Object.keys(content) : []
    const contentLangKey = contentKeys[0]

    const cleanedContent = contentLangKey ? decodeHtml(striptags(content[contentLangKey])) : ''
    const attachmentImage = getAttachmentImage(attachments)
    const { profileIcon, username } = parseUserInfo(comment, protocol, commenters)

    const pvComment: PVComment = {
      content: cleanedContent,
      imageUrl: attachmentImage?.url || null,
      profileIcon,
      published,
      replies: nestedReplies,
      url,
      username
    }

    return pvComment
  }

  const pvCommentThread = generatePVComment(rootNode, protocol)
  return pvCommentThread
}
