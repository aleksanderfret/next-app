/* eslint-disable no-console */
import fs from 'fs';

import getConfig from './getConfig';
import getCurrentBranch from './getCurrentBranch';

type CommitMessageConfig = {
  commitMessagePattern?: string;
  feedback?: string;
  pattern?: string;
  separator?: string;
  skipBranches?: string[];
  ticketNumberMaxLength?: string;
  ticketNumberMinLength?: string;
  ticketPrefix?: string;
  ticketSeparator?: string;
  type?: string[];
};

const branchToSkip = 'no branch';
const cliArguments = process.argv.slice(2);

const [messageFile] = cliArguments;

const {
  commitMessagePattern = '.*',
  separator = '/',
  skipBranches = [
    'main',
    'master',
    'dev',
    'staging',
    'qa',
    'test',
    '(no branch)',
  ],
  ticketPrefix = '',
  ticketNumberMaxLength,
  ticketNumberMinLength,
  ticketSeparator = '-',
  type,
} = getConfig<CommitMessageConfig>('validateGitNames') || {};

const branchesToSkip = new Set(skipBranches);

const buildPattern = () => {
  const branchType = type && type.length ? `(${type.join('|')}){1}` : '';
  const ticketNumber =
    ticketPrefix && ticketNumberMinLength
      ? `[0-9]{${ticketNumberMinLength},${ticketNumberMaxLength || ''}}`
      : '';

  const ticket = `${ticketPrefix}${
    ticketPrefix && ticketNumber ? ticketSeparator : ''
  }${ticketNumber}`;

  const start = commitMessagePattern.startsWith('^') ? 1 : 0;
  const end = commitMessagePattern.endsWith('$')
    ? commitMessagePattern.length - start - 1
    : commitMessagePattern.length - start;

  const msgPattern = commitMessagePattern.substring(start, end);

  return ticket && branchType
    ? `^(${branchType}${ticket ? `(${ticket})` : ''}!?: ${msgPattern})$`
    : '';
};

const isBranchInvalid = (branchName: string) =>
  branchesToSkip.has(branchName) || branchName.includes(branchToSkip);

const editCommitMessage = async (messageFile: string) => {
  const message = fs.readFileSync(messageFile, 'utf8').trim();
  const pattern = buildPattern();
  const commitRegExp = pattern ? new RegExp(pattern, 'g') : null;

  if (commitRegExp && commitRegExp.test(message)) {
    return;
  }

  try {
    const branchName = await getCurrentBranch();

    if (isBranchInvalid(branchName)) {
      return;
    }

    const parts = branchName.split(separator);

    if (parts.length < 3) {
      throw new Error(
        `Branch name ${branchName} doesn't follow the pattern ${pattern}`
      );
    }

    const [type, ticket] = parts;
    const parsedTicket = ticketSeparator
      ? ticket.split(ticketSeparator)
      : ticket;

    if (ticketPrefix) {
      if (
        (ticketSeparator && parsedTicket[0] !== ticketPrefix) ||
        (!ticketSeparator && ticket !== ticketPrefix)
      ) {
        throw new Error(
          `Invalid ticket name: ${parsedTicket} doesn't match ${ticketPrefix}`
        );
      }
    }

    const newTicket = `${
      ticketSeparator
        ? `${parsedTicket[0].toLowerCase()}${ticketSeparator}${parsedTicket[1]}`
        : ticket
    }`;

    if (message.includes(newTicket)) {
      return;
    }

    const hasBreakingChange = newTicket.endsWith('!');

    const finalTicket = hasBreakingChange ? newTicket.slice(0, -1) : newTicket;

    const messageRegExp = new RegExp(commitMessagePattern, 'g');

    if (!messageRegExp.test(message)) {
      throw new Error(
        `Commit message: ${message} does not follow the patter: ${commitMessagePattern}`
      );
    }

    const newMessage = `${type.toLowerCase()}(${finalTicket})${
      hasBreakingChange ? '!' : ''
    }: ${message}`;

    fs.writeFileSync(messageFile, newMessage);
    console.info(
      '\x1b[32m%s\x1b[0m',
      'Result: "created"\n' +
        `Commit Name: "${newMessage}" \n` +
        `Pattern:"${pattern.toString()}" \n`
    );
  } catch (e) {
    const { message } = (e || {}) as Error;
    console.error(
      '\x1b[31m%s\x1b[0m',
      'Result: "failed" \n' + `Error Msg: ${message || e} \n`
    );
    process.exit(1);
  }
};

if (/COMMIT_EDITMSG/g.test(messageFile)) {
  editCommitMessage(messageFile);
}
