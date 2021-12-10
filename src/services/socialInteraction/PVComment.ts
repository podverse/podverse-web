export type PVComment = {
  content: string | null
  id: string
  imageUrl: string | null
  isRoot?: boolean // set true if the top level comment
  // likesCount: number
  published: Date | null
  replies: PVComment[]
  // repliesCount: number
  repliesFirstNext: string | null // url to call to get the replies
  // retweetsCount: number
  url: string | null
  username: string | null
}
