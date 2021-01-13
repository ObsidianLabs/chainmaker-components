import React, { PureComponent } from 'react'

import {
  TableCard,
  TableCardRow,
} from '@obsidians/ui-components'

import moment from 'moment'

import networkManager from './networkManager'

export default class RemoteNetwork extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      info: null,
      status: null,
    }
  }

  componentDidMount () {
    this.refresh()
    this.h = setInterval(() => this.refreshBlock(), 5000)
  }

  componentDidUpdate (prevProps) {
    if (this.props.networkId !== prevProps.networkId) {
      this.refresh()
    }
  }

  componentWillUnmount () {
    clearInterval(this.h)
    this.h = undefined
  }

  async refresh () {
    this.setState({
      info: null,
      status: null,
    })
    if (!networkManager.sdk) {
      return
    }
    this.refreshBlock()
    const networkId = this.props.networkId
    const info = await networkManager.sdk?.networkInfo()
    if (this.props.networkId === networkId) {
      this.setState({ info })
    }
  }

  async refreshBlock () {
    if (!networkManager.sdk) {
      return
    }
    try {
      const networkId = this.props.networkId
      const status = await networkManager.sdk?.getStatus()
      if (this.props.networkId === networkId) {
        this.setState({ status })
      }
    } catch (error) {
      console.warn(error)
      this.setState({ status: null })
    }
  }

  render () {
    const { networkId } = this.props
    const { status, info } = this.state

    return (
      <div className='d-flex flex-1 flex-column overflow-auto'>
        <div className='d-flex'>
          <div className='col-6 p-0 border-right-black'>
            <TableCard title={`${process.env.CHAIN_NAME} Network (${networkId})`}>
              <TableCardRow
                name='Chain ID'
                badge={info?.chainId}
              />
              <TableCardRow
                name='ENS'
                badge={info?.ensAddress}
              />
            </TableCard>
          </div>
          <div className='col-6 p-0'>
            <TableCard title='Blocks'>
              <TableCardRow
                name='Block Number'
                badge={status?.number}
              />
              <TableCardRow
                name='Block Time'
                badge={status ? moment(status.timestamp * 1000).format('MMMM Do, HH:mm:ss') : ''}
              />
              <TableCardRow
                name='Difficulty'
                badge={status && Number(status.difficulty).toFixed(0)}
              />
            </TableCard>
          </div>
        </div>
        <div className='d-flex flex-fill'>
          <div className='col-12 p-0 border-top-black'>
          </div>
        </div>
      </div>
    )
  }
}


