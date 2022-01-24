export const alertPremiumRequired = (t: any) => {
  alert(t('This feature is only available for premium members'))
}

export const alertRateLimitError = (error: any) => {
  alert(error.response.data.message)
}

export const alertSomethingWentWrong = (t: any) => {
  alert(t('Something went wrong'))
}
