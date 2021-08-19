import { ethers } from 'ethers'
import utils from './utils'

export default class Contract {
  constructor ({ address, abi }, provider) {
    this.address = address
    this.abi = abi
    this.provider = provider
    this.instance = new ethers.Contract(address, abi, provider)
  }

  async query (method, { array }) {
    let result
    try {
      result = await this.instance.functions[method](...array)
    } catch (e) {
      throw utils.parseError(e)
    }
    const methodAbi = this.abi.find(item => item.name === method)
    const abi = methodAbi && methodAbi.outputs
    const parsed = this.parseObject(result, abi)
    return {
      raw: JSON.stringify(result, null, 2),
      parsed: Object.values(parsed),
    }
  }

  parseObject (values, abi) {
    const parsedOutputs = abi.map((param, index) => {
      const value = values[index]
      const { name, type, internalType } = param
      const parsed = this.parseValue(value, param, index)
      const result = { type, internalType, value: parsed }
      return [name || `(${index})`, result]
    })
    return Object.fromEntries(parsedOutputs)
  }

  parseValue (value, param) {
    const { type, internalType, components } = param
    if (type === 'tuple') {
      return this.parseObject(value, components)
    } else if (type.endsWith(']')) {
      const itemParam = {
        type: type.replace(/\[\d*\]/, ''),
        internalType: internalType.replace(/\[\d*\]/, ''),
        components,
      }
      return value.map(v => {
        const parsed = this.parseValue(v, itemParam)
        return { value: parsed, type: itemParam.type, internalType: itemParam.internalType }
      })
    } else if (type.startsWith('uint') || type.startsWith('int')) {
      return value.toString()
    } else if (type.startsWith('byte')) {
      return { hex: value, utf8: utils.format.utf8(value) }
    }
    return value
  }

  async execute (method, { array }, override) {
    try {
      const tx = await this.instance.populateTransaction[method](...array, override)
      const voidSigner = new ethers.VoidSigner(override.from, this.provider)
      return {
        tx: await voidSigner.populateTransaction(tx),
        getResult: async (tx, height) => {
          const data = await this.provider.call(tx, height)
          try {
            const result = this.instance.interface.decodeFunctionResult(method, data)
            return result
          } catch (e) {
            throw utils.parseError(e)
          }
        }
      }
    } catch (e) {
      throw utils.parseError(e)
    }
  }

  get maxGap () {
    return 100
  }

  async getLogs (event, { from, to }) {
    const filter = this.instance.filters[event.name]()
    try {
      const logs = await this.instance.queryFilter(filter, from, to)
      return logs
    } catch (e) {
      throw utils.parseError(e)
    }
  }
}