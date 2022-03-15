const { React } = require('powercord/webpack');

module.exports = ({ component, customID, componentName }) =>
  <div className="sci-parent">
    {component}
    <span className="sci-label" style={
      componentName === 'SelectActionComponent'
        ? { marginTop: '5px',
          display: 'inline-block' }
        : {}}>{customID}</span>
  </div>;
