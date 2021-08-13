import { ethers } from 'ethers'
import Big from 'big.js'

const display = value => {
  const amount = ethers.utils.formatEther(value)
  if (amount > 0.001) {
    return `${new Intl.NumberFormat().format(amount)} ETH`
  } else if (amount > 0.0000000001) {
    const gvalue = ethers.utils.formatUnits(value, 'gwei')
    return `${new Intl.NumberFormat().format(gvalue)} Gwei`
  } else {
    return `${new Intl.NumberFormat().format(value)} wei`
  }
}

export default {
  sign: {
    sha3: ethers.utils.keccak256
  },
  format: {
    big: value => Big(value),
    bytes: str => ethers.utils.toUtf8Bytes(str),
    utf8: hex => {
      try {
        return ethers.utils.toUtf8String(hex)
      } catch {
        return
      }
    },
    bytesFromHex: hex => ethers.utils.arrayify(hex),
  },
  unit: {
    fromValue: ethers.utils.formatEther,
    toValue: ethers.utils.parseEther,
    valueToGvalue: v => ethers.utils.formatUnits(v, 'gwei')
  },
  display,
  decodeError: () => '',
}