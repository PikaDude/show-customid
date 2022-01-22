const { React } = require('powercord/webpack');

module.exports = ({ component, customID, componentName }) =>
  <div className="sci-action-button-parent" style={{ width: componentName === 'SelectActionComponent' ? '100%' : null }}>
    {component}
    <span className="sci-action-button-label">{customID}</span>
  </div>;
