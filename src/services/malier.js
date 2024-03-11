const nodemailer = require('nodemailer')

const factoryTransporter = ({ from, senderPassword }) => {
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: from,
      pass: senderPassword
    }
  })

  return transporter
}

const sendNotificationEmail = ({
  from,
  senderPassword,
  to,
  subject,
  textBody
}) =>
  new Promise((resolve) => {
    const transporter = factoryTransporter({ from, senderPassword })

    const options = {
      to,
      from,
      subject,
      text: textBody
    }

    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.error(err)
        return resolve(false)
      }

      return resolve(true)
    })
  })

const sender = ({ to, code, from, senderPassword }) =>
  new Promise((resolve) => {
    const transporter = factoryTransporter({ from, senderPassword })
    const options = {
      to,
      from,
      subject: 'Dreambuilt recovery password',
      text: `Code: ${code ?? '123456'}`
    }

    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.error(err)
        return resolve(false)
      }

      return resolve(true)
    })
  })

module.exports = {
  senderMail: sender,
  sendNotificationEmail,
}
