import { DockerImageChannel } from '@obsidians/docker'
import notification from '@obsidians/notification'
import fileOps from '@obsidians/file-ops'
import semver from 'semver'

class CompilerManager {
  constructor () {
    this.truffle = new DockerImageChannel(process.env.DOCKER_IMAGE_COMPILER)
    this.solc = new DockerImageChannel('ethereum/solc', {
      filter: v => semver.valid(v) && !v.endsWith('alpine')
    })
    this._terminal = null
    this._truffleTerminal = null
    this._button = null
    this.notification = null
  }

  set terminal (v) {
    this._terminal = v
  }

  set truffleTerminal (v) {
    this._truffleTerminal = v
  }

  set button (v) {
    this._button = v
  }

  get projectRoot () {
    if (!this._terminal) {
      throw new Error('CompilerTerminal is not instantiated.')
    }
    return this._terminal.props.cwd
  }

  focus () {
    if (this._terminal) {
      this._terminal.focus()
    }
  }

  async build ({ compilers = {} }) {
    const projectRoot = this.projectRoot

    if (!compilers || !compilers[process.env.COMPILER_VERSION_KEY]) {
      notification.error(`No ${process.env.COMPILER_NAME} Version`, `Please select a version for ${process.env.COMPILER_NAME} in project settings.`)
      throw new Error(`No ${process.env.COMPILER_NAME} version.`)
    }

    const allVersions = await this.truffle.versions()
    if (!allVersions.find(v => v.Tag === compilers[process.env.COMPILER_VERSION_KEY])) {
      notification.error(`${process.env.COMPILER_NAME} ${compilers[process.env.COMPILER_VERSION_KEY]} not Installed`, `Please install the version in <b>${process.env.COMPILER_NAME} Manager</b> or select another version in project settings.`)
      throw new Error(`${process.env.COMPILER_NAME} version not installed`)
    }

    if (!compilers.solc) {
      notification.error('No Solc Version', `Please select a version for solc in project settings.`)
      throw new Error('No solc version.')
    }

    const allSolcVersions = await this.solc.versions()
    if (compilers.solc !== 'default' && !allSolcVersions.find(v => v.Tag === compilers.solc)) {
      notification.error(`Solc ${compilers.solc} not Installed`, `Please install the version in <b>Solc Manager</b> or select another version in project settings.`)
      throw new Error('Solc version not installed')
    }

    this._button.setState({ building: true })
    this.switchCompilerConsole('project')
    this.notification = notification.info(`Building Project`, `Building...`, 0)

    const cmd = this.generateBuildCmd({ projectRoot, compilers })
    const result = await this._terminal.exec(cmd)
    if (result.code) {
      this._button.setState({ building: false })
      this.notification.dismiss()
      notification.error('Build Failed', `Code has errors.`)
      throw new Error(result.logs)
    }

    this._button.setState({ building: false })
    this.notification.dismiss()

    notification.success('Build Successful', `The smart contract is compiled.`)
  }

  async stop () {
    if (this._terminal) {
      this._terminal.execAsChildProcess(`docker stop -t 1 truffle-compile`)
      await this._terminal.stop()
    }
  }

  generateBuildCmd({ projectRoot, compilers }) {
    const projectDir = fileOps.current.getDockerMountPath(projectRoot)
    const cmd = [
      `docker run -t --rm --name truffle-compile`,
      '-v /var/run/docker.sock:/var/run/docker.sock',
      `-v "${projectDir}:${projectDir}"`,
      `-w "${projectDir}"`,
      `${process.env.DOCKER_IMAGE_COMPILER}:${compilers[process.env.COMPILER_VERSION_KEY]}`,
      `${process.env.COMPILER_EXECUTABLE_NAME} compile`,
    ]
    
    if (compilers.solc !== 'default') {
      cmd.push(`--compilers.solc.version '${compilers.solc}'`)
      cmd.push(`--compilers.solc.docker 1`)
    }
    
    return cmd.join(' ')
  }
}

export default new CompilerManager()