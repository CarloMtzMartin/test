const generateRecoveryCode = () => {
  const code = new Array(6)
    .fill(0)
    .map((_) => Math.floor(Math.random() * 8) + 1)
    .join('')
  return code
}

module.exports = {
  generateRecoveryCode
}
