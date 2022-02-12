import type {
  ActivityPubThreadcapAttachment,
  ActivityPubThreadcapNode,
  ActivityPubThreadcapResponse,
  PVComment
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

  const comment = convertThreadcapToPVComment(response.data)
  comment.isRoot = true
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

const getAttachmentImage = (attachments: ActivityPubThreadcapAttachment[]) => {
  return attachments.find((attachment: ActivityPubThreadcapAttachment) => attachment?.mediaType?.indexOf('image') === 0)
}

const convertThreadcapToPVComment = (response: ActivityPubThreadcapResponse) => {
  const { /* commenters, */ nodes, root } = response
  const rootNode = nodes[root]

  const generatePVComment = (node: ActivityPubThreadcapNode) => {
    const { comment, replies } = node
    const { attachments, attributedTo, content, published, url } = comment

    const nestedReplies = replies.map((replyUrl: string) => {
      const nestedNode = nodes[replyUrl]
      let pvComment = null
      if (nestedNode) {
        pvComment = generatePVComment(nestedNode)
      }
      return pvComment
    })

    const contentKeys = content && typeof content === 'object' ? Object.keys(content) : []
    const contentLangKey = contentKeys[0]

    const cleanedContent = contentLangKey ? decodeHtml(striptags(content[contentLangKey])) : ''
    const attachmentImage = getAttachmentImage(attachments)
    const username = parseUserName(attributedTo)

    const pvComment: PVComment = {
      content: cleanedContent,
      imageUrl: attachmentImage?.url || null,
      published,
      replies: nestedReplies,
      url,
      username
    }

    return pvComment
  }

  const pvCommentThread = generatePVComment(rootNode)
  return pvCommentThread
}
