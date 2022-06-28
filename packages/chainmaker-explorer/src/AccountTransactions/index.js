import React, { PureComponent } from 'react'
import { TableCard, Badge} from '@obsidians/ui-components'
import { networkManager } from '@obsidians/chainmaker-network'
import { t } from '@obsidians/i18n'
import TransactionRow from './TransactionRow'

export default class AccountTransactions extends PureComponent {
  state = {
    hasMore: true,
    loading: true,
    txsList: [],
    page: 0,
    total: -1,
    size: 10,
    hide: false,
    error: '',
    header: ''
  }

  componentDidMount () {
    this.refresh(this.props.blockValue)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.blockValue !== this.props.blockValue) {
      this.refresh(this.props.blockValue)
    }
  }

  refresh = async value => {
    const blockInfo = await networkManager.sdk.getBlockInfo(value)
    if (!blockInfo) {
      this.props.handleFailed()
      this.setState({ loading: false })
      return
    }
    const { block: { txsList, header } } = blockInfo
    this.setState({ txsList: txsList, header: header, loading: false })
  }

  loadMore = async () => {
    // this.setState({ loading: true, error: '' })
    // const { total, list: txs, noExplorer } = await networkManager.sdk.getTransactions(this.props.account.address, this.state.page, this.state.size)
    // if (noExplorer) {
    //   this.setState({ hide: true })
    //   return
    // }
    // if (Array.isArray(txs)) {
    //   this.setState({
    //     txs: [...this.state.txs, ...txs],
    //     total,
    //     page: this.state.page + 1,
    //     hasMore: total ? (this.state.txs.length + txs.length) < total : txs.length === this.state.size,
    //   })
    // } else {
    //   this.setState({ error: txs })
    // }
    // this.setState({ loading: false })
  }

  renderTableBody = () => {
    const { TransactionRow } = this.props
    if(this.state.txsList.length === 0) return
    const rows = this.state.txsList.map(tx => (
      <TransactionRow
        blockHeight={this.state.header.blockHeight}
        txDetail={tx} />
    ))

    if (this.state.loading) {
      rows.push(
        <tr key='txs-loading' className='bg-transparent'>
          <td align='middle' colSpan={8}>
            <i className='fas fa-pulse fa-spinner mr-1' />{t('loading')}...
          </td>
        </tr>
      )
    } else if (this.state.error) {
      rows.push(
        <tr key='txs-loadmore' className='bg-transparent'>
          <td align='middle' colSpan={8}>
            {this.state.error}
          </td>
        </tr>
      )
    } else if (!this.state.txsList.length) {
      rows.push(
        <tr key='txs-loadmore' className='bg-transparent'>
          <td align='middle' colSpan={8}>
            {t('explorer.transactions.noTransactions')}
          </td>
        </tr>
      )
    }
    // } else if (this.state.hasMore) {
    //   rows.push(
    //     <tr key='txs-loadmore' className='bg-transparent'>
    //       <td align='middle' colSpan={8}>
    //         <span className='btn btn-sm btn-secondary' onClick={this.loadMore}>{t('explorer.transactions.loadMore')}</span>
    //       </td>
    //     </tr>
    //   )
    // }

    return rows
  }


  render () {
    const TransactionHeader = this.props.TransactionHeader
    if (this.state.hide) return null
    
    return (
      <TableCard
        title={
          <div className='d-flex flex-row align-items-end'>
            <h4 className='mb-0'>Block Information</h4>
          </div>
        }
        tableSm
        TableHead={<TransactionHeader />}
      >
        {this.renderTableBody()}
      </TableCard>
    )
  }
}

const TransactionHeader = () => (
  <tr>
    <th style={{ width: '6%', textAlign: 'left'}}>{'BlockHeight'}</th>
    <th style={{ width: '14%', textAlign: 'left' }}>{'TxId'}</th>
    <th style={{ width: '17%', textAlign: 'left' }}>{'signer'}</th>
    {/* <th style={{ width: '15%', textAlign: 'center'}}>{'From'}</th> */}
    <th style={{ width: '17%', textAlign: 'left'}}>{'Target Contract'}</th>
    <th style={{ width: '8%',  textAlign: 'left' }}>{'Deploy Time'}</th>
    <th style={{ width: '15%', textAlign: 'left' }}>{'Status'}</th>
  </tr>
)

AccountTransactions.defaultProps = {
  TransactionHeader,
  TransactionRow,
}