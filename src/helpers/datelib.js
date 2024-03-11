// yyyy-mm-dd hh:mm:ss || yyyy-mm-dd
const getMonth = (date) => {
  if (!Date.parse(date)) {
    // dependiendo de algun error en la fecha, esta siempre va mostrar
    // Enero
    return 1
  }

  const month = new Date(date + " 00:00:00").getMonth() + 1

  return month
}

const getDaysOfMonth = ({ month, year }) => {
  const toValue = parseInt(month)
  if (toValue < 1 || toValue > 12) {
    return 0
  }

  const date = new Date(year, toValue, 0)

  return date.getDate()
}

const fullDatetimeNow = () => {
  const date = new Date()
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

const getCurrentYear = () => {
  const date = new Date()
  return date.getFullYear();
}

module.exports = {
  getMonth,
  getDaysOfMonth,
  getCurrentYear,
  fullDatetimeNow
}
