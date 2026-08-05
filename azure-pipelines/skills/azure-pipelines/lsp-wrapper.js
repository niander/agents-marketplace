#!/usr/bin/env node
'use strict';

const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SCHEMA_URL =
  process.env.AZURE_PIPELINES_LSP_SCHEMA_URL ||
  'https://raw.githubusercontent.com/microsoft/azure-pipelines-vscode/main/service-schema.json';

const DEFAULT_GLOBS = [
  '**/azure-pipelines.yml',
  '**/azure-pipelines.yaml',
  '**/azure-pipelines-*.yml',
  '**/azure-pipelines-*.yaml',
  '**/.azure-pipelines/**/*.yml',
  '**/.azure-pipelines/**/*.yaml',
  '**/.pipelines/**/*.yml',
  '**/.pipelines/**/*.yaml',
];

const SCHEMA_GLOBS = process.env.AZURE_PIPELINES_LSP_GLOBS
  ? process.env.AZURE_PIPELINES_LSP_GLOBS.split(',').map((value) => value.trim()).filter(Boolean)
  : DEFAULT_GLOBS;

const DEBUG = Boolean(process.env.AZURE_PIPELINES_LSP_DEBUG);

function log(message) {
  if (DEBUG) process.stderr.write(`[az-pipelines-lsp-wrapper] ${message}\n`);
}

function installDependencies() {
  const npmArgs = ['ci', '--omit=dev', '--ignore-scripts', '--no-audit', '--no-fund'];
  const command = process.platform === 'win32'
    ? process.env.ComSpec || 'cmd.exe'
    : 'npm';
  const args = process.platform === 'win32'
    ? ['/d', '/s', '/c', `npm ${npmArgs.join(' ')}`]
    : npmArgs;
  const result = spawnSync(
    command,
    args,
    {
      cwd: __dirname,
      encoding: 'utf8',
      windowsHide: true,
    }
  );

  if (result.stdout) process.stderr.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) process.stderr.write(`${result.error.message}\n`);
  return result.status === 0;
}

function loadMinimatch() {
  try {
    return require('minimatch').minimatch;
  } catch {
    log('npm dependencies are missing; installing from package-lock.json');
  }

  if (!installDependencies()) {
    process.stderr.write(
      '[az-pipelines-lsp-wrapper] failed to install npm dependencies. ' +
      `Run "npm ci" in "${__dirname}".\n`
    );
    process.exit(127);
  }

  try {
    return require('minimatch').minimatch;
  } catch (error) {
    process.stderr.write(
      `[az-pipelines-lsp-wrapper] cannot load minimatch after installation: ${error.message}\n`
    );
    process.exit(127);
  }
}

const minimatch = loadMinimatch();

function resolveServerEntry() {
  if (process.env.AZURE_PIPELINES_LSP_BIN) {
    return process.env.AZURE_PIPELINES_LSP_BIN;
  }

  try {
    const packageJson = require.resolve('azure-pipelines-language-server/package.json', {
      paths: [__dirname],
    });
    const packageDefinition = require(packageJson);
    let binary = packageDefinition.bin;
    if (typeof binary === 'object') {
      binary = binary['azure-pipelines-language-server'] || Object.values(binary)[0];
    }
    return path.join(path.dirname(packageJson), binary);
  } catch {
    // Fall through to global installation locations.
  }

  for (const root of [
    path.join(process.env.APPDATA || '', 'npm', 'node_modules'),
    path.join(path.dirname(process.execPath), 'node_modules'),
  ]) {
    if (!root) continue;
    const candidate = path.join(
      root,
      'azure-pipelines-language-server',
      'bin',
      'azure-pipelines-language-server'
    );
    if (fs.existsSync(candidate)) return candidate;
  }

  return null;
}

let serverEntry = resolveServerEntry();
if (!serverEntry || !fs.existsSync(serverEntry)) {
  log('language server is missing; installing from package-lock.json');
  if (installDependencies()) serverEntry = resolveServerEntry();
}

if (!serverEntry || !fs.existsSync(serverEntry)) {
  process.stderr.write(
    '[az-pipelines-lsp-wrapper] cannot locate azure-pipelines-language-server. ' +
    `Run "npm ci" in "${__dirname}".\n`
  );
  process.exit(127);
}

log(`server entry: ${serverEntry}`);
log(`node: ${process.execPath}`);

const server = spawn(process.execPath, [serverEntry, '--stdio'], {
  stdio: ['pipe', 'pipe', 'inherit'],
});

function forwardSignal(signal) {
  server.kill(signal);
}

const handleSigterm = () => forwardSignal('SIGTERM');
const handleSigint = () => forwardSignal('SIGINT');

server.on('error', (error) => {
  process.stderr.write(`[az-pipelines-lsp-wrapper] failed to spawn server: ${error.message}\n`);
  process.exit(1);
});

server.on('exit', (code, signal) => {
  if (!signal) {
    process.exit(code ?? 0);
  }

  process.removeListener('SIGTERM', handleSigterm);
  process.removeListener('SIGINT', handleSigint);
  process.kill(process.pid, signal);
});

function encodeMessage(message) {
  const body = JSON.stringify(message);
  return Buffer.concat([
    Buffer.from(`Content-Length: ${Buffer.byteLength(body, 'utf8')}\r\n\r\n`, 'ascii'),
    Buffer.from(body, 'utf8'),
  ]);
}

function createFramedReader(onMessage) {
  let buffer = Buffer.alloc(0);

  return function ingest(chunk) {
    buffer = buffer.length === 0 ? chunk : Buffer.concat([buffer, chunk]);

    while (true) {
      const headerEnd = buffer.indexOf('\r\n\r\n');
      if (headerEnd < 0) return;

      const header = buffer.slice(0, headerEnd).toString('ascii');
      const match = /Content-Length:\s*(\d+)/i.exec(header);
      if (!match) {
        buffer = buffer.slice(1);
        continue;
      }

      const length = Number.parseInt(match[1], 10);
      const bodyStart = headerEnd + 4;
      if (buffer.length < bodyStart + length) return;

      const raw = buffer.slice(0, bodyStart + length);
      const body = buffer.slice(bodyStart, bodyStart + length);
      buffer = buffer.slice(bodyStart + length);

      let json = null;
      try {
        json = JSON.parse(body.toString('utf8'));
      } catch {
        // Preserve malformed messages so the underlying endpoint can handle them.
      }

      onMessage({ raw, json });
    }
  };
}

function buildConfigNotification() {
  return encodeMessage({
    jsonrpc: '2.0',
    method: 'workspace/didChangeConfiguration',
    params: {
      settings: {
        yaml: {
          format: { enable: false },
          validate: true,
          schemas: { [SCHEMA_URL]: SCHEMA_GLOBS },
          customTags: [],
        },
        http: {
          proxy: process.env.HTTPS_PROXY || process.env.HTTP_PROXY || '',
          proxyStrictSSL: false,
        },
      },
    },
  });
}

function uriToPathLike(uri) {
  try {
    if (uri.startsWith('file://')) {
      const parsed = new URL(uri);
      let filePath = decodeURIComponent(parsed.pathname);
      if (process.platform === 'win32' && /^\/[a-zA-Z]:/.test(filePath)) {
        filePath = filePath.slice(1);
      }
      return filePath.replace(/\\/g, '/');
    }
  } catch {
    // Fall back to treating the URI as a path-like string.
  }

  return uri.replace(/\\/g, '/');
}

function matchesPipelineGlob(uri) {
  const filePath = uriToPathLike(uri);
  const basename = path.posix.basename(filePath);

  return SCHEMA_GLOBS.some((glob) => {
    const options = { nocase: true, dot: true, matchBase: false };
    if (minimatch(filePath, glob, options)) return true;
    return !glob.includes('/') && minimatch(basename, glob, options);
  });
}

let injected = false;
const clientReader = createFramedReader(({ raw, json }) => {
  server.stdin.write(raw);
  if (injected || !json || json.method !== 'initialized') return;

  injected = true;
  log('client initialized; injecting schema configuration');
  try {
    server.stdin.write(buildConfigNotification());
  } catch (error) {
    process.stderr.write(`[az-pipelines-lsp-wrapper] configuration injection failed: ${error.message}\n`);
  }
});

process.stdin.on('data', clientReader);
process.stdin.on('end', () => {
  try {
    server.stdin.end();
  } catch {
    // The server may already have exited.
  }
});

const interceptedRequests = new Set([
  'custom/schema/request',
  'custom/schema/content',
]);

const serverReader = createFramedReader(({ raw, json }) => {
  if (
    json &&
    typeof json.id !== 'undefined' &&
    json.method &&
    interceptedRequests.has(json.method)
  ) {
    let result = null;

    if (json.method === 'custom/schema/request') {
      const uri = Array.isArray(json.params) ? json.params[0] : json.params;
      if (typeof uri === 'string' && matchesPipelineGlob(uri)) {
        result = SCHEMA_URL;
        log(`custom/schema/request ${uri} -> ${SCHEMA_URL}`);
      } else {
        log(`custom/schema/request ${uri} -> null`);
      }
    } else {
      log('custom/schema/content -> null');
    }

    try {
      server.stdin.write(encodeMessage({ jsonrpc: '2.0', id: json.id, result }));
    } catch (error) {
      process.stderr.write(`[az-pipelines-lsp-wrapper] schema reply failed: ${error.message}\n`);
    }
    return;
  }

  process.stdout.write(raw);
});

server.stdout.on('data', serverReader);

process.on('SIGTERM', handleSigterm);
process.on('SIGINT', handleSigint);
