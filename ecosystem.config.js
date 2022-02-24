module.exports = {
  apps : [{
    name: 'client',
    script: 'cd benji-client/ && npm run dev',
    watch: './benji-client/'
  },
    {
      name: 'bot',
      script: 'cd backend/ && npm run dev'
    }
  ],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
