/**
 * 区块订阅
 * startBlock: 订阅起始区块高度，若为-1，表示订阅实时最新区块(number)
 * endBlock: 订阅结束区块高度，若为-1，表示订阅实时最新区块(number)
 * withRwSet: 是否返回读写集(boolean)
 * callBack: 回调函数，第一个参数是监听到的的block区块，第二个参数是错误信息
 * subscribeBlock(sdk, 10, 12, true, true)
 * */
const subscribeBlock = async (sdk, startBlock, endBlock, onlyHeader, withRwSet, callBack) => {
  try {
    const response = await sdk.subscribe.subscribeBlock(startBlock, endBlock, withRwSet, onlyHeader, (block, err) => {
      console.log(block);
      console.log(err);
    });
    console.log('subscribeBlock-response', response)
    return response
  } catch (e) {
    console.log('subscribeBlock failed', e)
  }
}

/**
 * 交易订阅
 * startBlock: 订阅起始区块高度，若为-1，表示订阅实时最新区块(number)
 * endBlock: 订阅结束区块高度，若为-1，表示订阅实时最新区块(number)
 * contractName: 订阅交易类型,若为common.TxType(-1)，表示订阅所有交易类型(number)
 * txIds: 订阅txId列表，若为空(null)，表示订阅所有txId(Array[string])
 * callBack: 回调函数，第一个参数是监听到的交易，第二个参数是错误信息
 * subscribeTx(sdk, -1, -1, null, null)
 * */
const subscribeTx = async (sdk, startBlock, endBlock, contractName, txIds, callBack) => {
  try {
    const response = await sdk.subscribe.subscribeTx(startBlock, endBlock, contractName, txIds, (tx, err) => {
      console.log(tx);
      console.log(err);
    });
    console.log('subscribeTx-response', response)
    return response
  } catch (e) {
    console.log('subscribeTx failed', e)
  }
}

/**
 * 合约事件订阅
 * topic: 订阅的主题(string)
 * contractName: 智能合约名称(string)
 * callBack: 回调函数，第一个参数是监听到的交易，第二个参数是错误信息
 * subscribeContractEvent(sdk, 'topic_vx', 'go_ctx_003')
 * */
const subscribeContractEvent = async (sdk, topic, contractName, callBack) => {
  try {
    const response = await sdk.subscribe.subscribeContractEvent(topic, contractName, (ct, err) => {
      console.log(ct);
      console.log(err);
    });
    console.log('subscribeContractEvent-response', response)
    return response
  } catch (e) {
    console.log('subscribeContractEvent failed', e)
  }
}

/**
 * 查询链信息
 * getChainInfo(sdk)
 * */
const getChainInfo = async (sdk) => {
  try {
    const response = await sdk.callSystemContract.getChainInfo();
    console.log('getChainInfo-response', response)
    return response
  } catch (e) {
    console.log('getChainInfo failed', e)
  }
}

/**
 * 查询节点加入的链信息
 * nodeAddr: 节点地址,如127.0.0.1(string)
 * getNodeChainList(sdk,'127.0.0.1:12301')
 * */
const getNodeChainList = async (sdk, nodeAddr) => {
  try {
    const response = await sdk.callSystemContract.getNodeChainList(nodeAddr);
    console.log('getNodeChainList-response', response)
    return response
  } catch (e) {
    console.log('getNodeChainList failed', e)
  }
}

/**
 * 根据区块高度查询区块
 * blockHeight: 区块高度,若为-1，将返回最新区块(number)
 * withRWSet: 是否返回读写集(boolean)
 * */
const getBlockByHeight = async (sdk, blockHeight, withRWSet) => {
  try {
    const response = await sdk.callSystemContract.getBlockByHeight(blockHeight, withRWSet);
    console.log('getBlockByHeight-response', response)
    return response
  } catch (e) {
    console.log('getBlockByHeight failed', e)
  }
}

/**
 * 根据区块哈希查询区块
 * blockHash: 区块哈希(string)
 * withRWSet: 是否返回读写集(boolean)
 * */
const getBlockByHash = async (sdk, blockHash, withRWSet) => {
  try {
    const response = await sdk.callSystemContract.getBlockByHash(blockHash, withRWSet);
    console.log('getBlockByHash-response', response)
    return response
  } catch (e) {
    console.log('getBlockByHash failed', e)
  }
}

/**
 * 根据交易Id查询区块
 * txId: 交易ID(string)
 * withRWSet: 是否返回读写集(boolean)
 * */
const getBlockByTxId = async (sdk, txId, withRWSet) => {
  try {
    const response = await sdk.callSystemContract.getBlockByTxId(txId, withRWSet);
    console.log('getBlockByTxId-response', response)
    return response
  } catch (e) {
    console.log('getBlockByTxId failed', e)
  }
}

/**
 * 根据交易Id查询交易
 * txId: 交易ID(string)
 * */
const getTxByTxId = async (sdk, txId) => {
  try {
    const response = await sdk.callSystemContract.getTxByTxId(txId);
    console.log('getTxByTxId-response', response)
    return response
  } catch (e) {
    console.log('getTxByTxId failed', e)
  }
}

/**
 * 查询最新链配置
 * getChainInfo(sdk)
 * */
const getChainInfoConfig = async (sdk) => {
  try {
    const response = await sdk.chainConfig.getChainConfig()
    console.log('getChainInfo-response', response)
    return response
  } catch (e) {
    console.log('getChainInfo failed', e)
  }
}

/**
 * 根据指定区块高度查询最近链配置
 * getChainConfigByBlockHeight(sdk, 1)
 * */
const getChainConfigByBlockHeight = async (sdk, blockHeight) => {
  try {
    const response = await sdk.chainConfig.getChainConfigByBlockHeight(blockHeight)
    console.log('getChainConfigByBlockHeight-response', response)
    return response
  } catch (e) {
    console.log('getChainConfigByBlockHeight failed', e)
  }
}

/**
 * 获取最新区块信息
 * */
const getLastBlock = async (sdk, withRWSet) => {
  try {
    const response = await sdk.callSystemContract.getLastBlock(withRWSet)
    console.log('getLastBlock-response', response)
    return response
  } catch (e) {
    console.log('getLastBlock failed', e)
  }
}

module.exports = {
  subscribeBlock,
  subscribeTx,
  subscribeContractEvent,
  getChainInfo,
  getNodeChainList,
  getBlockByHeight,
  getBlockByHash,
  getBlockByTxId,
  getTxByTxId,
  getChainInfoConfig,
  getChainConfigByBlockHeight,
  getLastBlock
}