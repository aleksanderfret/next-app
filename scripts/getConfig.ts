import fs from 'fs';

interface Config {
  [key: string]: any;
}

const getConfig = <T extends Config>(configName: string): T | null => {
  if (!configName) {
    throw new Error('Config name ws not provided');
  }

  const { cwd } = process;
  const root = cwd();
  const configFile = fs.readFileSync(`${root}/package.json`, 'utf8');

  if (!configFile) {
    throw new Error('Config was not found');
  }

  const parsedConfig = configFile ? JSON.parse(configFile) : null;
  const config = parsedConfig[configName] || null;

  return config;
};

export default getConfig;
