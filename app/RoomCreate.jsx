import React, {Component} from 'react';

class RoomCreate extends Component {
  render() {
    return (
      <div>
        <h2>create a room</h2>
        <div className='room-create-container'>
          <input id='create-room-name' type='text' placeholder='Room Name'></input>
          <input id='create-room-lifetime' type='text' placeholder='Expiry time'></input>
          <button className='btn-create' onClick={() => this.props.createRoom()}>Create</button>
          <button className='btn-back' onClick={() => this.props.changeView('lobby')}>Cancel</button>
        </div>
      </div>
    )
  }
}

export default RoomCreate;
