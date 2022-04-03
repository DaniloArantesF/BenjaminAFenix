module.exports = {
  apps: [
    {
      name: 'client',
      script: 'cd benji-client/ && npm run dev',
      watch: './benji-client/'
    },
    {
      name: 'backend',
      script: 'cd backend/ && npm run dev',
      watch: './backend/'
    }
  ],
};
