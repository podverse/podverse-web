export type PVComment = {
  content: string | null
  id: string
  imageUrl: string | null
  // likesCount: number
  published: Date | null
  replies: PVComment[]
  // repliesCount: number
  repliesFirstNext: string | null // url to call to get the replies
  // retweetsCount: number
  url: string | null
  username: string | null
}
