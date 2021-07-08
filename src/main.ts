import * as core from '@actions/core'
import * as github from '@actions/github'
import execa from 'execa'
import {PullRequestEvent} from '@octokit/webhooks-types'
import {Context} from '@actions/github/lib/context'

const notPrCreationTriggered = (event: Context): boolean => {
  return event.eventName === 'pull request'
}

const getPrHeadBranchName = (event: Context): string => {
  const payload = event.payload as PullRequestEvent
  return payload.pull_request.head.ref
}

async function run(): Promise<void> {
  try {
    if (notPrCreationTriggered(github.context)) {
      return core.setFailed(
          'The action not triggered by pull request creation event'
      )
    }

    const prHead = getPrHeadBranchName(github.context)
    const expected: string = core.getInput('expected', {
      required: true
    })

    await execa.command(`git checkout --track origin/${prHead}`)
    await execa.command(`git checkout --track origin/${expected}`)

    const {stdout} = await execa.command(`git branch --contains ${prHead}`)
    core.debug(stdout)

    if (stdout.length > 0) {
      const branches = stdout.split(/[(\r\n)]+/)
      if (branches.find(branch => branch.indexOf(expected))) {
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
