import express from 'express';
import fs from 'fs';
import Inspector from 'inspector-api';

const PORT = 8001;

const Profiler = async () => {
  const app = express();
  const inspector = new Inspector();
  await inspector.profiler.enable();

  const start = async () => {
    await inspector.profiler.start();
  };

  const stop = async () => {
    const profile = await inspector.profiler.stop();
    if (profile) {
      fs.writeFileSync('./profile.json', JSON.stringify(profile));
    }
  }

  app.get('/start', (req, res) => {
    start();
    res.send("Profiler Started!");
  });

  app.get('/stop', (req, res) => {
    stop();
    res.send("Profiler Stopped!");
  });

  app.listen(PORT, () => {
    console.info(`Profiler Server listening at ${PORT}`)
  })
};

export default () => Profiler();
