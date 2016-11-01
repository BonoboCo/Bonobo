import React, {Component} from 'react';
class Message extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const thisTime = moment(this.props.data.createdAt).fromNow();
    return (
      <div className='msg-object'>
        Sum Gai<span className='msg-creator'>{this.props.data.createdBy}</span> said at
        <span className='msg-timestamp'>{thisTime}</span> :
        <span className='msg-body'>{this.props.data.msgBody}</span>
      </div>
    )
  }
}

export default Message;