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
    this.channel.invoke('init', this.filterOption(initOption))
  }

  invokeCall(methodName, ...data) {
    return this.channel.invoke('call', methodName, ...data)
  }

  async invokeClassCall(className, methodName, ...data) {
    return await this.channel.invoke('callContract', className, methodName, ...data)
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
      timestamp: header.blockTimestamp,
      blockHash: header.blockHash,
      blockVersion: header.blockVersion
    }
  }

  async getBlockInfo(blockStr) {
    const resultbyHeight = await this.invokeCall('getBlockByHeight', blockStr)
    const resultByHash = await this.invokeCall('getBlockByHash', blockStr)
    console.log('resultbyHeight9', resultbyHeight)
    console.log('resultByHash9', resultByHash)
    if(!!resultByHash && !!resultByHash) return undefined
    if(!!resultbyHeight) return resultbyHeight
    if(!!resultByHash) return resultByHash
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

  dispose() {
    if (platform.isDesktop) {
      this.channel.invoke('dispose')
    }
  }
}