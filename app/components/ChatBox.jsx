import React, {Component} from 'react';
import Message from './Message';

const HOST = 'http://localhost:3000/';

class Chatbox extends Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket;
  }
  componentDidMount() {
    console.log('mounting room', this.props.currentRoomId);
    const getReq = new XMLHttpRequest;
    getReq.open("GET", HOST + 'rooms/' + this.props.currentRoomId);
    getReq.addEventListener('load', () => {
      const data = JSON.parse(getReq.responseText);
      console.log('Data GOT', data);
      if (data.roomObj && ((moment(data.roomObj.expires) - moment()) > 0)) this.props.addGotMessagesAndRoomData(data);
      else this.props.changeView('lobby');
    });
    getReq.send();
  }
  postMsg() {
    const msg = document.getElementById('newmsgbody').value;
    const msgObj = {
      msgBody: msg,
    };
    console.log('message to post:', JSON.stringify(msgObj));
    const postReq = new XMLHttpRequest;
    postReq.addEventListener('load', () => {
      console.log('New Message Posted. ', postReq.responseText);
      this.socket.emit('post', JSON.parse(postReq.responseText));
      // this.props.addNewMessages(JSON.parse(postReq.responseText));
    });
    postReq.open("POST", HOST + 'rooms/' + this.props.currentRoomId);
    postReq.setRequestHeader("Content-type", "application/json");
    postReq.send(JSON.stringify(msgObj));
  }
  render() {
    const messagedivs = [];
    for (let i = 0; i < this.props.messages.length; i++) {
      messagedivs.push(
        <Message
          addGiphy = {this.props.addGiphy}
          index = {i}
          key = {`msg${i}`}
          data = {this.props.messages[i]} />
      );
    }
    return  (
      <div className="chatbox-container">
        {messagedivs}
          <input type='text' id='newmsgbody' name='msgbody'></input>
          <button className='btn-postmsg' onClick={() => this.postMsg()}>Post</button>
      </div>
    )
  }
}

export default Chatbox;
