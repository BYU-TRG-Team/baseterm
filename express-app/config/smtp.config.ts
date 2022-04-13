export default {
  password: process.env.EMAIL_PASSWORD as string,
  email: process.env.EMAIL_ADDRESS as string,
  provider: process.env.EMAIL_PROVIDER as string,
};