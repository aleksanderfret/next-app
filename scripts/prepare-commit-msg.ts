import { exec as childProcessExec } from 'child_process';
import fs from 'fs';
import util from 'util';

const commitName = /^\[[A-Z]{3}-[0-9]{1,5}\].*$/;
const branchToSkip = 'no branch';
const cliArguments = process.argv.slice(2);
const [messageFile] = cliArguments;
const branchesToSkip = new Set([
  'main',
  'master',
  'dev',
  'staging',
  'test',
  '(no branch)',
]);

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

const isBranchInvalid = (branchName: string) =>
  branchesToSkip.has(branchName) || branchName.includes(branchToSkip);

const editCommitMessage = async (messageFile: string) => {
  const message = fs.readFileSync(messageFile, 'utf8').trim();

  if (commitName.test(message)) {
    return;
  }

  try {
    const branchName = await getCurrentBranch();

    if (isBranchInvalid(branchName)) {
      return;
    }

    const prefix = branchName.split('_').slice(0, 2);
    const ticket = '[' + prefix[0].toUpperCase() + '-' + prefix[1] + ']';

    if (message.includes(ticket)) {
      return;
    }

    const newMessage = ticket + ' ' + message;

    fs.writeFileSync(messageFile, newMessage);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

if (/COMMIT_EDITMSG/g.test(messageFile)) {
  editCommitMessage(messageFile);
}
