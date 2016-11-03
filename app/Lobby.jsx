import React, { Component } from 'react';
import Room from './components/Room.jsx';

import { withGoogleMap, GoogleMap, Circle } from "react-google-maps";
import _ from "lodash";

const HOST = 'http://localhost:3000/';

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.lat = 0;
    this.long = 0;
  }

  componentWillMount() {
    function error(e) {
      console.log('geolocation error', e);
    }
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;
      const getReq = new XMLHttpRequest;
      getReq.open("GET", HOST + 'roomlist');
      getReq.setRequestHeader('Content-Type', 'application/json');
      getReq.setRequestHeader('Lat', this.lat);
      getReq.setRequestHeader('Long', this.long);
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

    const GettingStartedGoogleMap = withGoogleMap(props => (
      <GoogleMap
        ref={props.onMapLoad}
        defaultZoom={15}
        defaultCenter={{ lat: this.lat, lng: this.long }}
        onClick={props.onMapClick}
        options={{scrollwheel: false}}
        >
        <Circle
          center={{ lat: this.lat, lng: this.long }}
          draggable={false}
          radius={300}
          visible={true}
          options={{fillColor: '#FFFF00', strokeColor: '#000000', strokeOpacity: 0.6, strokeWeight: 2,}}
          onClick={_.noop}
          onRightClick={_.noop}
          onDragStart={_.noop}
          />
      </GoogleMap>
    ));

    return (
      <div id='lobby-container'>
        <img id='logo' src='http://i.imgur.com/J0XqyGh.png' />
        <GettingStartedGoogleMap
          containerElement={<div style={{ height: 250, width: '100%' }} />}
          mapElement={<div style={{ height: 250, width: '100%' }} />}
          onMapLoad={_.noop}
          onMapClick={_.noop}
          onMarkerRightClick={_.noop}
          />
        <div id='room-create-container'>
          <input id='create-room-name' type='text' placeholder='Room Name'></input>
          <input id='create-room-lifetime' type='text' placeholder='Expiry Time'></input>
          <button className='btn-bigger' onClick={() => this.props.createRoom()}>Create</button>
        </div>
        <div id='room-div-container'>
          {roomDivs}
        </div>
      </div>
    )
  }
}

export default Lobby;
