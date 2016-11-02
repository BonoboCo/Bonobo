import React, {Component} from 'react';

class Message extends Component {
  componentDidMount() {
    // giphy api constants
    const GIPHY_TRIGGER = '/giphy ';
    const GIPHY_API_URI = 'http://api.giphy.com/v1/gifs';
    const GIPHY_API_KEY = 'dc6zaTOxFJmzC';

    // 1. detect if msg body starts with GIPHY_TRIGGER
    // 2. fetch a giphy img uri from the giphy api with rest of the msg body
    // 3. create an img elem with the img uri and replace msg body via addGiphy(..)
    const giphyDetected = this.props.data.msgBody.substring(0, GIPHY_TRIGGER.length) === GIPHY_TRIGGER;
    if (giphyDetected) {
      const giphyKeyword = this.props.data.msgBody.substring(GIPHY_TRIGGER.length);
      fetch(`${GIPHY_API_URI}/translate?s=${giphyKeyword}&api_key=${GIPHY_API_KEY}`)
        .then(res => res.json())
        .then(data => {
          const imgUri = data.data.images.fixed_height.url;
          const giphyComponent = <img src={imgUri} />;
          //console.log(this.props);
          this.props.addGiphy(this.props.index, giphyComponent);
        })
        .catch(err => console.error('[error] giphy api fetch:', err));
    }
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
