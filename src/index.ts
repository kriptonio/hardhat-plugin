import { input, password, select } from '@inquirer/prompts';

import { KriptonioError, KriptonioSdk } from '@kriptonio/sdk';
import {
  TASK_COMPILE_SOLIDITY_COMPILE_JOB,
  TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOB_FOR_FILE,
  TASK_COMPILE_SOLIDITY_GET_DEPENDENCY_GRAPH,
} from 'hardhat/builtin-tasks/task-names';
import { task, types } from 'hardhat/config';
import {
  Artifact,
  CompilationJob,
  DependencyGraph,
  HardhatRuntimeEnvironment,
} from 'hardhat/types';
import { getConfig } from './config';

import './type-extensions';
import { Build, KriptonioUploadConfig } from './types';

async function uploadToKriptonio(
  config: KriptonioUploadConfig,
  hre: HardhatRuntimeEnvironment
) {
  const fqns = await hre.artifacts.getAllFullyQualifiedNames();
  const artifacts = await Promise.all(
    fqns.map((fqn) => hre.artifacts.readArtifact(fqn))
  );

  const contractName =
    config.contract ||
    (await select({
      message: 'Contract:',
      choices: artifacts.reverse().map((artifact) => ({
        name: artifact.contractName,
        value: artifact.contractName,
      })),
      loop: false,
      default: config.contract,
    }));

  const artifact = await hre.artifacts.readArtifact(contractName);
  const build = await getBuild(hre, artifact);

  try {
    const accessToken =
      config.accessToken ||
      (await password({
        message: 'Access Token:',
        mask: '*',
      }));

    const chainId =
      config.chainId ||
      ((await input({
        message: 'Chain ID:',
      })) as unknown as number);

    const title =
      config.title ||
      (await input({
        message: 'Title:',
        default: contractName,
      }));

    const sdk = new KriptonioSdk({ accessToken });
    sdk.configure({ apiUrl: config.apiUrl });

    const smartContract = await sdk.smartContract.createFromStandardJson({
      contractName,
      chainId,
      title,
      contractFile: artifact.sourceName,
      contractStandardJson: JSON.stringify(build.input),
    });

    console.log(
      `Created Smart Contract with ID ${smartContract.id}. Visit ${config.appUrl} too see it.`
    );
  } catch (e) {
    if (e instanceof KriptonioError) {
      throw new Error(`Server error. ${formatError(e)}`);
    }

    throw e;
  }
}

async function getBuild(
  hre: HardhatRuntimeEnvironment,
  artifact: Artifact
): Promise<Build> {
  const dependencyGraph: DependencyGraph = await hre.run(
    TASK_COMPILE_SOLIDITY_GET_DEPENDENCY_GRAPH,
    {
      sourceNames: [artifact.sourceName],
    }
  );

  const resolvedFiles = dependencyGraph
    .getResolvedFiles()
    .filter((resolvedFile) => {
      return resolvedFile.sourceName === artifact.sourceName;
    });

  const compilationJob: CompilationJob = await hre.run(
    TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOB_FOR_FILE,
    {
      dependencyGraph,
      file: resolvedFiles[0],
    }
  );

  return await hre.run(TASK_COMPILE_SOLIDITY_COMPILE_JOB, {
    compilationJob,
    compilationJobs: [compilationJob],
    compilationJobIndex: 0,
    emitsArtifacts: false,
    quiet: false,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatError(error: KriptonioError) {
  const parts = [];
  if (error.code) {
    parts.push(error.code);
  }

  if (error.message) {
    parts.push(error.message);
  }

  return parts.join('. ');
}

task('kriptonio-upload', 'Upload your contract to Kriptonio')
  .addOptionalParam(
    'contract',
    'Contract name to upload',
    undefined,
    types.string
  )
  .addOptionalParam('accessToken', 'Access token', undefined, types.string)
  .addOptionalParam('chainId', 'Chain ID', undefined, types.int)
  .addOptionalParam(
    'title',
    'Smart contract title on kriptonio',
    undefined,
    types.string
  )
  .addOptionalParam('apiUrl', 'Kriptonio API endpoint', undefined, types.string)
  .addOptionalParam('appUrl', 'Kriptonio Web App URL', undefined, types.string)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    await hre.run('compile');
    await uploadToKriptonio(getConfig(taskArgs, hre.config.kriptonio), hre);
  });
