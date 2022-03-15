const { React } = require('powercord/webpack');

module.exports = ({ component, customID, componentName }) =>
  <div className="sci-parent" style={{ width: componentName !== 'ButtonActionComponent' ? '100%' : null }}>
    {component}
    <span className="sci-label sci-hover-label">{customID}</span>
  </div>;
