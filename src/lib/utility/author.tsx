export const generateAuthorText = authors => {
  let authorText = ''
  if (authors && authors.length > 0) {
    for (let i = 0; i < authors.length; i++) {
      const author = authors[i]
      authorText += `${author.name}${i < authors.length - 1 ? ', ' : ''}`
    }
  }

  return authorText
}
