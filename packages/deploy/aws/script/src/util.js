const execa = require('execa');

const execCommand = async (command, options = {}) => {
  let commandParts = command;

  if (typeof command === 'string') {
    commandParts = command.split(' ').filter(part => !!part.trim());
  }

  const commandName = commandParts.shift();
  const commandArguments = commandParts;
  console.log('command', command);

  return execa(commandName, commandArguments, { stdio: 'inherit', ...options });
};

module.exports = {
  execCommand,
};
