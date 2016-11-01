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
        defaultZoom={17}
        defaultCenter={{ lat: this.lat, lng: this.long }}
        onClick={props.onMapClick}
        >
        <Circle
          center={{ lat: this.lat, lng: this.long }}
          draggable={false}
          radius={50}
          visible={true}
          onClick={_.noop}
          onRightClick={_.noop}
          onDragStart={_.noop}
          />
      </GoogleMap>
    ));

    return (
      <div className='lobby-container'>
        <h1>bonobo</h1>
        {roomDivs}
        <button className='btn-create' onClick={() => this.props.changeView('createRoom')}>Create New Room</button>
        <GettingStartedGoogleMap
          containerElement={<div style={{ height: 400, width: 400 }} />}
          mapElement={<div style={{ height: 400, width: 400 }} />}
          onMapLoad={_.noop}
          onMapClick={_.noop}
          onMarkerRightClick={_.noop}
          />
      </div>
    )
  }
}

export default Lobby;
