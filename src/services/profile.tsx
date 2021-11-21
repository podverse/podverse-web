import { request } from "~/services/request"

export const getPublicUsersByQuery = async (page: number, userIds: string[]) => {
  const filteredQuery = {
    ...(page ? { page } : { page: 1 }),
    ...(userIds ? { userIds } : {})
  }

  const response = await request({
    endpoint: `/user`,
    query: filteredQuery
  })

  return response && response.data
}