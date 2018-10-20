import React, { Component, Fragment } from 'react'
import axios from 'axios'
import NowPlaying from '~/components/NowPlaying/NowPlaying'
import Meta from '~/components/meta'
import { getMediaRefById, getMediaRefsByQuery } from '~/services/mediaRef'

type Props = {
  mediaRef: any
  mediaRefs: any[]
}

type State = {}

export default class extends Component<Props, State> {

  static async getInitialProps(req) {
    const res = await axios.all([
      getMediaRefById(req.query.id), 
      getMediaRefsByQuery({ 
        podcastTitle: `The James Altucher Show`
      })
    ])
    const mediaRef = res[0].data;
    const mediaRefs = res[1].data;
    
    return { mediaRef, mediaRefs }
  }

  render () {
    const { mediaRef, mediaRefs } = this.props

    return (
      <Fragment>
        <Meta />
        <NowPlaying 
          listItems={mediaRefs}
          nowPlayingData={mediaRef} />
      </Fragment>
    )
  }

}