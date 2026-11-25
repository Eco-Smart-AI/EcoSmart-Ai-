const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Reduce worker concurrency to prevent Windows file descriptor exhaustion (EMFILE)
config.maxWorkers = 2;

// Block unnecessary directories from being crawled and watched by Metro
const customBlockList = [
  /.*[\\/]\.git[\\/].*/,
  /.*[\\/]\.expo[\\/].*/,
  /.*[\\/]\.vscode[\\/].*/,
  /.*[\\/]node_modules[\\/].*[\\/]node_modules[\\/].*/,
];

if (Array.isArray(config.resolver.blockList)) {
  config.resolver.blockList.push(...customBlockList);
} else {
  config.resolver.blockList = customBlockList;
}

module.exports = config;
