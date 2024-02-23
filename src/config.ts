import { KriptonioUploadConfig } from './types';

function getKey(
  key: keyof KriptonioUploadConfig,
  cliConfig: Partial<KriptonioUploadConfig>,
  hardhatConfig?: Partial<KriptonioUploadConfig>
) {
  return cliConfig[key] || hardhatConfig?.[key];
}

export function getConfig(
  cliConfig: KriptonioUploadConfig,
  hardhatConfig?: Partial<KriptonioUploadConfig>
): KriptonioUploadConfig {
  return {
    chainId: getKey('chainId', cliConfig, hardhatConfig) as number,
    accessToken: getKey('accessToken', cliConfig, hardhatConfig) as string,
    title: getKey('title', cliConfig, hardhatConfig) as string,
    apiUrl:
      (getKey('apiUrl', cliConfig, hardhatConfig) as string) ||
      'https://api.kriptonio.com',
    appUrl:
      (getKey('appUrl', cliConfig, hardhatConfig) as string) ||
      'https://app.kriptonio.com',
    contract: getKey('contract', cliConfig, hardhatConfig) as string,
  };
}
