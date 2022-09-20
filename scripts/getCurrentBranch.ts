import { exec as childProcessExec } from 'child_process';
import util from 'util';

const exec = util.promisify(childProcessExec);

const getCurrentBranch = async (): Promise<string> => {
  const { stderr, stdout: branches } = await exec('git branch');

  if (stderr) {
    throw new Error(stderr);
  }

  const branch =
    branches
      .split('\n')
      .find((branch: string) => branch.trim().charAt(0) === '*') || '';

  return branch.trim().substring(2);
};
export default getCurrentBranch;
