#!/usr/bin/env node
'use strict';

const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const serverEntry = path.join(
  __dirname,
  'node_modules',
  'typescript-language-server',
  'lib',
  'cli.mjs'
);
const typescriptEntry = path.join(
  __dirname,
  'node_modules',
  'typescript',
  'lib',
  'tsserver.js'
);

function dependenciesPresent() {
  return fs.existsSync(serverEntry) && fs.existsSync(typescriptEntry);
}

function installDependencies() {
  const npmArgs = ['ci', '--omit=dev', '--ignore-scripts', '--no-audit', '--no-fund'];
  const command = process.platform === 'win32'
    ? process.env.ComSpec || 'cmd.exe'
    : 'npm';
  const args = process.platform === 'win32'
    ? ['/d', '/s', '/c', `npm ${npmArgs.join(' ')}`]
    : npmArgs;
  const result = spawnSync(command, args, {
    cwd: __dirname,
    encoding: 'utf8',
    windowsHide: true,
  });

  if (result.stdout) process.stderr.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) process.stderr.write(`${result.error.message}\n`);
  return result.status === 0;
}

if (!dependenciesPresent()) {
  process.stderr.write('[typescript-lsp] installing pinned npm dependencies\n');
  if (!installDependencies() || !dependenciesPresent()) {
    process.stderr.write(
      `[typescript-lsp] dependency installation failed. Run "npm ci" in "${__dirname}".\n`
    );
    process.exit(127);
  }
}

const server = spawn(process.execPath, [serverEntry, '--stdio'], {
  cwd: __dirname,
  stdio: 'inherit',
  windowsHide: true,
});

const handleSigterm = () => server.kill('SIGTERM');
const handleSigint = () => server.kill('SIGINT');

server.on('error', (error) => {
  process.stderr.write(`[typescript-lsp] failed to start language server: ${error.message}\n`);
  process.exit(1);
});

server.on('exit', (code, signal) => {
  if (signal) {
    process.removeListener('SIGTERM', handleSigterm);
    process.removeListener('SIGINT', handleSigint);
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

process.on('SIGTERM', handleSigterm);
process.on('SIGINT', handleSigint);
