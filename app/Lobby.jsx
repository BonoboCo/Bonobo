import React, { Component } from 'react';
import Room from './components/Room.jsx';

import moment from 'moment';

class Lobby extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    function error(e) {
      console.log('geolocation error', e);
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      const getReq = new XMLHttpRequest;
      getReq.open("GET", HOST + 'roomlist');
      getReq.setRequestHeader('Content-Type', 'application/json');
      getReq.setRequestHeader('Lat', lat);
      getReq.setRequestHeader('Long', long);
      getReq.addEventListener('load', () => {
        this.props.addGotRooms(JSON.parse(getReq.responseText));
      });
      getReq.send();
    }, error);
  }

  render() {
    const roomDivs = [];
    for (let i = 0; i < this.props.roomList.length; i++) {
      const expiry = moment(this.props.roomList[i].expires).fromNow();
      roomDivs.push(<Room key={`room${i}`} data={this.props.roomList[i]} expiry={expiry} joinRoom={this.props.joinRoom} />);
    }
    return (
      <div className='lobby-container'>
        <h2>Welcome to the Lobby</h2>
        {roomDivs}
        <button className='btn-create' onClick={() => this.props.changeView('createRoom')}>Create New Room</button>
      </div>
    )
  }
}

export default Lobby;