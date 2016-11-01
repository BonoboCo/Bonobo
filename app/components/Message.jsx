import React, {Component} from 'react';
class Message extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const thisTime = moment(this.props.data.createdAt).fromNow();

    return (
      <div className='msg-object'>
        <div style={{display:'inline-block', width:'100%'}}>
          <span style={{float:'left'}} className='msg-creator'>{this.props.data.createdby}</span>
          <span style={{float:'right'}} className='msg-timestamp'><small>{thisTime}</small></span>
        </div>
        <div style={{width:'100%', paddingLeft:'9px', paddingRight:'9px', textAlign:'left'}}>
          <span className='msg-body'>{this.props.data.msgBody}</span>
        </div>
      </div>
    )
  }
}

export default Message;