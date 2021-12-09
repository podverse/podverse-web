import { request } from "./request"

type ActivityPubNote = {
  attachment: {
    mediaType: string
    url: string
  }
  attributedTo: string
  content: string
  inReplyToAtomUri: string | null
  published: Date
  replies: {
    first: {

    }
  }
}

type ActivityPubCollectionPage = {
  
}

type Comment = {
  author: string
  imageUrl?: string
  likes: number
  parentId: string
  published: Date
  replies: number
  retweets: number
  username: string
}

export const getActivityPubNoteData = async (url: string) => {
  const response = await request({
    url,
    headers: {
      Accept: 'application/activity+json'
    }
  })
  console.log('response', response)

  const { data } = response

  const note = parseActivityPubNoteResponse(data)

  return response && response.data
}

const parseActivityPubNote = (noteResponse: ActivityPubNote) => {
  
  const author = note
}
