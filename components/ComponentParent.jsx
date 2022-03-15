const { React } = require('powercord/webpack');

module.exports = ({ component, customID }) =>
  <div className="sci-parent">
    {component}
    <span className="sci-label">{customID}</span>
  </div>;
