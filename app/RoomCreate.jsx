import React, {Component} from 'react';

class RoomCreate extends Component {
  render() {
    return (
      <div className="room-create-container">
        <input id='create-room-name' type='text' placeholder='Room Name'></input>
        <input id='create-room-lifetime' type='text' placeholder='Expiry time'></input>
        <button className='btn-back' onClick={() => this.props.changeView('lobby')}>Cancel</button>
        <button className='btn-create' onClick={() => this.props.createRoom()}>Create</button>
      </div>
    )
  }
}

export default RoomCreate;