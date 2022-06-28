import platform from '@obsidians/platform'
import { IpcChannel } from '@obsidians/ipc'
const { REACT_APP_SERVER_URL } = process.env

export default class InvokeClient {
  constructor(initOption) {
    this.channel = platform.isDesktop ? new IpcChannel('sdk') : new IpcChannel()
    this.invokeInit(initOption)
  }

  filterOption({ chainId, orgId, userKeyString, userCertString, nodeConfigArray, timeout = 3000 }) {
    return {
      initSDkData: {
        chainId,
        orgId,
        userKeyString,
        userCertString,
        nodeConfigArray,
        timeout
      },
      initUserData: {
        orgId,
        userKeyString,
        userCertString
      }
    }
  }

  invokeInit(initOption) {
    const result = this.filterOption(initOption)
    this.channel.invoke('init', result)
  }

    invokeCall(methodName, ...data) {
    return this.channel.invoke('call', methodName, ...data)
  }

   async networkInfo() {
     const { block: { header } } = await this.invokeCall('getLastBlock', 'true')

     return {
       chainId: header.chainId
     }
  }

  async getStatus() {
    const { block: { header } } = await this.invokeCall('getLastBlock', true)
    return {
      number: header.blockHeight,
      timestamp: header.blockTimestamp
    }
  }

  async latest() {
    console.log('latest')
    return ''
  }

  async getAccount(address) {
    console.log('getAccount')
    return ''
  }

  async getTransactions(address, page, size) {
    console.log('getTransactions')
    return ''
  }

  async getTokens(address) {
    console.log('getTokens')
    return ''
  }

  async getTokenInfo(address) {
    console.log('getTokenInfo')
    return ''
  }

  async _getTokenTotalSupply(address) {
    console.log('_getTokenTotalSupply')
    return ''
  }

  async callRpc(method, params) {
    console.log('callRpc')
    return ''
  }

  dispose() {}
}