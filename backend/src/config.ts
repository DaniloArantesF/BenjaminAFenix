export default {
  PORT: 8000,

  // Time in ms where users are not allowed to send more than one
  // interaction. The next command will be run only when cooldown is over.
  // *Note* The discord api requires a reply within 3 seconds. If cooldown is greater than 3000, you need to defer reply and edit it later.
  COOLDOWN_MS: 2500,
};
