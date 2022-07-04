const { IpcChannel } = require('@obsidians/ipc')
const SdkClient  = require('./SdkClient')

module.exports = class SdkChannel extends IpcChannel {
  constructor () {
    super('sdk')
    this.explorer = new ExplorerChannel()
    this.sdkclient = new SdkClient()
    this.classList = {}
  }

  init({ initSDkData, initUserData }) {
    this.dispose()
    this.sdkclient.initSDK(initSDkData)
    this.sdkclient.initUserList(initUserData)
    this.sdkclient.initMethods()
    console.log(this.sdkclient.sdkInstance.userContractMgr['createContractCreatePayload'])
  }

  call(methodName, ...data) {
    return this.sdkclient.invokeMethods(methodName, ...data)
  }

  async callContract(className, funcName, params) {
    if (params.userInfoList) {
      params.userInfoList = await this.sdkclient.initUserListWithCurrentOrg(params.userInfoList)
    }
    let res = await this.sdkclient.sdkInstance[className][funcName](params)
    console.log(res)
    return res
  }

  dispose() {
    this.sdkclient.dispose()
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