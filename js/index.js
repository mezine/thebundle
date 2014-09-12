/** @jsx React.DOM */

var React = require('react');
var ImageUploaderModal = require('./modals/image-uploader-modal');

var App = React.createClass({
  getInitialState: function () {
    return {
      id: 'colorful.jpg',
      text: "Hello Mario World!"
    }
  },
  onSubmitImage: function (data) {
    this.setState({
      id: data.id,
      text: data.text
    });
  },
  open: function () {
    ImageUploaderModal.open({
      target: $('#div-1'),
      text: this.state.text,
      id: 'colorful.jpg',
      width: 320,
      height: 240,
      onSubmit: this.onSubmitImage
    });
  },
  render: function () {
    return (<button onClick={this.open}>
      {this.state.text}
    </button>)
  }
});

React.renderComponent(<App/>, document.getElementById('div-1'));