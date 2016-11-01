import React, { Component } from 'react';

class Room extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className='room-object'>
        <span className='room-name'>{this.props.data.name}</span>
        <span className='room-creator'>Creator: {this.props.data.creatorid}</span>
        <span className='room-expires'>Expires: {this.props.expiry}</span>
        <button className='btn-joinroom' onClick={() => this.props.joinRoom(this.props.data)}>Join</button>
      </div>
    )
  }
}

export default Lobby;