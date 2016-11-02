import React, { Component } from 'react';
import Chatbox from './components/Chatbox.jsx';
import UserList from './components/UserList.jsx';

class RoomView extends Component {
  render() {
    const expiry = moment(this.props.roomObj.expires).fromNow();
    return (
      <div id='chatroom-container'>
        <h3>Room: {this.props.roomObj.name}</h3>
        <h4>Expires: {expiry}</h4>
        <button className = 'btn-back' onClick = {() => this.props.changeView('lobby')}>Back to Lobby</button>
        <UserList 
          currentRoomId = {this.props.currentRoomId}
          users = {this.props.users}
          addNewUsers= {this.props.addNewUsers}/>
        <Chatbox
          changeView = {this.props.changeView}
          messages = {this.props.messages}
          addGotMessagesAndRoomData = {this.props.addGotMessagesAndRoomData}
          currentRoomId = {this.props.currentRoomId}
          addNewMessages = {this.props.addNewMessages}
          socket = {this.props.socket}/>
      </div>
    );
  }
}

export default RoomView;