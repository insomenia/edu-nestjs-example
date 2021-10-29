export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:8080',
});
