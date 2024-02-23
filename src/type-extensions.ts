import 'hardhat/types/config';
import { KriptonioUploadConfig } from './types';

declare module 'hardhat/types/config' {
  interface HardhatUserConfig {
    kriptonio?: Partial<KriptonioUploadConfig>;
  }

  interface HardhatConfig {
    kriptonio?: Partial<KriptonioUploadConfig>;
  }
}
