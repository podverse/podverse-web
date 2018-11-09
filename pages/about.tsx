import React, { Component, Fragment } from 'react'
import Meta from '~/components/meta'

type Props = {}

type State = {}

export default class extends Component<Props, State> {
  render() {
    return (
      <Fragment>
        <Meta />
        <h3>About</h3>
        <p>Create and share podcast highlights</p>
        <p>Create and share playlists</p>
        <p>Free and open source software <i className="fa fa-copyright fa-flip-horizontal"></i></p>
        <p>Will never sell user data</p>
        <hr />
        <h3>Team</h3>
        <p>Creon Creonopoulos - Programmer</p>
        <p>Mitch Downey – Programmer</p>
        <p>Gary Johnson - UX / Graphic Design</p>
        <p>Vincent Schramer – Programmer</p>
      </Fragment>
    )
  }
}