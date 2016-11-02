import React, { Component } from 'react';

const HOST = 'http://localhost:3000/';

class UserList extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log('mounting userList in room', this.props.currentRoomId);
    const getReq = new XMLHttpRequest;
    getReq.open("GET", HOST + 'rooms/' + this.props.currentRoomId + '/users');
    getReq.addEventListener('load', () => {
      const data = JSON.parse(getReq.responseText);
      console.log('Data GOT', data);
      this.props.addNewUsers(data);
    });
    getReq.send();
  }

  render() {
    const userDivs = [];
    for (let i = 0; i < this.props.users.length; i++) {
      userDivs.push(<div key={i} className="users" >{this.props.users[i].displayname}</div>)
    }
    return (
      <div className="user-container">
        <div className="user-title">Current Users:</div>
        {userDivs}
      </div>
    )
  }
}

export default UserList;