const { IpcChannel } = require('@obsidians/ipc')
const SdkClient  = require('./SdkClient')

module.exports = class SdkChannel extends IpcChannel {
  constructor () {
    super('sdk')
    this.explorer = new ExplorerChannel()
    this.sdkclient = new SdkClient()
  }

  init({ initSDkData, initUserData }) {
    this.sdkclient.initSDK(initSDkData)
    this.sdkclient.initUserList(initUserData)
    this.sdkclient.initMethods()
  }

  call(methodName, ...data) {
    return this.sdkclient.invokeMethods(methodName, ...data)
  }
}

class ExplorerChannel extends IpcChannel {
  constructor() {
    super('explorer')
  }

  async GET(networkId, query) {
      return { result: [] }
  }
}