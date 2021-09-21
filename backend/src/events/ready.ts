
module.exports = {
  name: 'ready',
  once: true,
  execute(client: any) {
    console.info(`Bot ready!`);
  }
}