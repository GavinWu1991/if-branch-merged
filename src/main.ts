import * as core from '@actions/core'
import execa from 'execa'

async function run(): Promise<void> {
  try {
    // TODO: get pr head branch
    const prHead = ''
    const expectedBranch: string = core.getInput('expectedBranch', {
      required: true
    })

    await execa.command(`git fetch origin ${expectedBranch}`)

    const {stdout} = await execa.command(`git branch --contains ${prHead}`)
    core.debug(stdout)

    if (stdout.length > 0) {
      // TODO: found merged branch need to continue validate
    } else {
      core.setFailed('the branch has not been merged to xxxx branch.')
    }
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()
