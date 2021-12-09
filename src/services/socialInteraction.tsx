import { request } from "./request"

export const getSocialInteractionActivityPubData = async (url: string) => {
  const response = await request({
    url,
    headers: {
      Accept: 'application/activity+json'
    }
  })
  console.log('response', response)
  return response && response.data
}
