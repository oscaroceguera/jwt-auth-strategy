module.exports = {
  server: {
    host: 'localhost',
    port: 3000
  },
  database: 'mongodb://localhost:27017/tokenlogin',
  privateKey: 'ab9894e9-2227-45b0-bbf8-b6f171a36c1c',
  algorithm: 'aes-256-ctr',
  email: {
    username: "*****@gmail.com",
    password: "*****",
    accountName: "gmail",
    verifyEmailUrl: "verifyEmail"
  }
}
