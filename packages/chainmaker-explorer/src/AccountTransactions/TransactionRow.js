import React, { PureComponent } from 'react'
// import { Badge } from '@obsidians/ui-components'
// import { networkManager } from '@obsidians/chainmaker-network'
import moment from 'moment'
import Address from './Address'

export default class TransactionRow extends PureComponent {
  onClick = () => {}

  render () {
    const { blockHeight, txDetail } = this.props

    return (
      <tr onClick={this.onClick}>
        <td><small>{blockHeight}</small></td>
        <td>
          <div className='flex-1 overflow-hidden'>
            <Address addr={txDetail.payload.txId} redirect={false}/>
          </div>
        </td>
        <td>
          <Address addr={txDetail.sender.signer.orgId} redirect={false} />
        </td>
        <td>
          {txDetail.payload.contractName}
        </td>
        <td>
          <small>{moment(txDetail.payload.timestamp * 1000).format('MM/DD HH:mm:ss')}</small>
        </td>
        <td>
          {txDetail.result?.contractResult?.message  || 'None'}
        </td>
      </tr>
    )
  }
}
