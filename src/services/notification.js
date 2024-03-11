const { NotifyType } = require('./identifiers')
const { sendNotificationEmail } = require('./malier')



/* Informacion del usuario implicado viene "payload" */
const sendNotification = async ({ from, senderPassword, to, payload, typeNotify }) => {
  const context = NotifyType[typeNotify]
  const mainWeb = 'https://app.dreambuilt.com.mx/'
  let subject = `Solicitud de ${context} - App DreamBuilt` 
  let textBody = `
    Se realizó una nueva solicitud de: ${context}
    Usuario: ${payload?.name}\n
    Correo: ${payload?.email}\n
    Teléfono: ${payload?.phone}\n

    Revisa la "${context}" en: ${mainWeb}
  `;

  const result = await sendNotificationEmail({
    from,
    senderPassword,
    to,
    subject,
    textBody
  })
  return result
}

module.exports = {
  sendNotification
}
