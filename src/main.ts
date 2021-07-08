import * as core from '@actions/core'
import * as github from '@actions/github'
import execa from 'execa'
import {PullRequestEvent} from '@octokit/webhooks-types'

const notPrCreationTriggered = (): boolean => {
  return github.context.eventName === 'pull request'
}

const getPrHeadBranchName = (): string => {
  const payload = github.context.payload as PullRequestEvent
  return payload.pull_request.head.ref
}

async function run(): Promise<void> {
  try {
    if (notPrCreationTriggered()) {
      return core.setFailed(
        'The action not triggered by pull request creation event'
      )
    }

    const prHead = getPrHeadBranchName()
    const expected: string = core.getInput('expected', {
      required: true
    })

    await execa.command(`git fetch origin ${expected}`)

    const {stdout} = await execa.command(`git branch --contains ${prHead}`)
    core.debug(stdout)

    if (stdout.length > 0) {
      const branchs = stdout.split(/[(\r\n)]+/)
      if (branchs.find(branch => branch.indexOf(expected))) {
        // TODO: add comment to PR if configured
        return
      }
    } else {
      core.setFailed('the branch has not been merged to xxxx branch.')
    }
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()
