/* eslint-disable no-console */
import getConfig from './getConfig';
import getCurrentBranch from './getCurrentBranch';

type ValidateBranchNameConfig = {
  pattern: string;
  feedback?: string;
};

const validateBranchName = async () => {
  const config = getConfig<ValidateBranchNameConfig>('validateGitNames');

  if (config) {
    const { pattern, feedback } = config;
    const branchName = await getCurrentBranch();

    const branchPattern = new RegExp(pattern, 'g');

    const match = branchPattern.test(branchName);

    if (match) {
      console.info(
        '\x1b[32m%s\x1b[0m',
        'Result: "passed"\n' +
          `Branch Name: "${branchName}" \n` +
          `Pattern:"${branchPattern.toString()}" \n`
      );
      process.exitCode = 0;
    } else {
      console.error(
        '\x1b[31m%s\x1b[0m',
        'Result: "failed" \n' +
          `Error Msg: ${feedback} \n` +
          `Branch Name: "${branchName}" \n` +
          `Pattern:"${branchPattern.toString()}" \n`
      );
      process.exit(1);
    }
  }
};

validateBranchName();
