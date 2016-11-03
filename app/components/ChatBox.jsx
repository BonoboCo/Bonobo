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

    document.getElementById('newMsgBody').addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        this.postMsg();
      }
    });
  }
  postMsg() {
    const msg = document.getElementById('newMsgBody').value;
    const msgObj = {
      msgBody: msg,
    };
    console.log('message to post:', JSON.stringify(msgObj));
    const postReq = new XMLHttpRequest;
    postReq.addEventListener('load', () => {
      console.log('New Message Posted. ', postReq.responseText);
      this.socket.emit('post', JSON.parse(postReq.responseText));
    });
    postReq.open("POST", HOST + 'rooms/' + this.props.currentRoomId);
    postReq.setRequestHeader("Content-type", "application/json");
    postReq.send(JSON.stringify(msgObj));

    document.getElementById('newMsgBody').value = '';
  }
  render() {
    const messageDivs = [];
    for (let i = 0; i < this.props.messages.length; i++) {
      messageDivs.push(
        <Message
          addGiphy = {this.props.addGiphy}
          index = {i}
          key = {`msg${i}`}
          data = {this.props.messages[i]} />
      );
    }
    return (
      <div>
        <div className='chatbox-container'>
          {messageDivs}
        </div>
        <div id='msgPostDiv'>
          <input type='text' id='newMsgBody' name='msgbody'></input>
          <button className='btn-postmsg'
            onClick = {this.postMsg.bind(this)}>
            Post
          </button>
        </div>
      </div>
    )
  }
}

export default Chatbox;
