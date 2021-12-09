import { request } from "./request"

type ActivityPubNoteResponse = {
  author: string
  imageUrl?: string
  likes: number
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

const parseActivityPubNoteResponse = (noteResponse: ActivityPubNoteResponse) => {

}
