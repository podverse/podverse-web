import React, { Component, ReactNode } from 'react'
import { MediaPlayer, convertToNowPlayingItem } from 'podverse-ui'

type Props = {
  children?: ReactNode
  nowPlayingData?: any
}

type State = {
  nowPlayingItem?: any
}

class MediaPlayerView extends Component<Props, State> {

  constructor (props) {
    super(props)
    
    if (props.nowPlayingData) {
      this.state = {
        nowPlayingItem: convertToNowPlayingItem(props.nowPlayingData)
      }
    }
  }  

  render () {    
    const { children } = this.props
    const { nowPlayingItem } = this.state  

    return (
      <div className='view'>
        <div className='view__top'>
          {children}
        </div>
        {
          nowPlayingItem &&
            <div className='view__bottom'>
              <MediaPlayer
                handleOnAutoplay={this.onAutoplay}
                handleOnEpisodeEnd={this.onEpisodeEnd}
                handleOnPastClipTime={this.onPastClipTime}
                handleOnSkip={this.onSkip}
                nowPlayingItem={nowPlayingItem}
                showAutoplay={true}
                showTimeJumpBackward={false} />
            </div>
          }
      </div>
    )
  }

  onAutoplay () {
    console.log('onAutoplay')
  }

  onEpisodeEnd () {
    console.log('onEpisodeEnd')
  }

  onPastClipTime () {
    console.log('onPastClipTime')
  }

  onSkip () {
    console.log('onSkip')
  }
}

export default MediaPlayerView
