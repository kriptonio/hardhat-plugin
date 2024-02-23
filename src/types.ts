import { CompilationJob, CompilerInput, CompilerOutput } from 'hardhat/types';

export interface Build {
  compilationJob: CompilationJob;
  input: CompilerInput;
  output: CompilerOutput;
  solcBuild: {
    version: string;
  };
}

export interface KriptonioUploadConfig {
  title: string;
  contract: string;
  apiUrl: string;
  appUrl: string;
  accessToken: string;
  chainId: number;
}
