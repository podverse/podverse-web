type TokenRecord = {
  token: string
  createdAt: number
}

const tokens: Record<string, TokenRecord> = {}

export const saveToken = (token: string) => {
  tokens[token] = { token, createdAt: Date.now() }
}

export const removeToken = (token: string) => {
  delete tokens[token]
}

export const listTokens = () => Object.keys(tokens)

export default { saveToken, removeToken, listTokens }
