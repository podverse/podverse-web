import moment from 'moment'

export const readableDate = (date: Date, withTime: boolean) => {
  const format = withTime ? 'MMM Do YYYY, h:mm:ss a' : 'MMM Do YYYY'
  return moment(date).format(format)
}

Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf())
  date.setDate(date.getDate() + days)
  return date
}

export const isBeforeDate = (expirationDate, dayOffset = 0) => {
  const currentDate = new Date() as any
  const offsetDate = currentDate.addDays(dayOffset)
  return new Date(expirationDate) > offsetDate
}
