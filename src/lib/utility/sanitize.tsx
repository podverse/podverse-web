import sanitizeHtml from 'sanitize-html'

export const sanitizeTextHtml = (html: string) => {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      a: ['data-start-time', 'href', 'rel', 'target']
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', {
        target: '_blank',
        rel: 'noopener noreferrer'
      })
    }
  })
}
