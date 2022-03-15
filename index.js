const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { React, getModule } = require('powercord/webpack');

const ComponentParent = require('./components/ComponentParent');
const ComponentHoverParent = require('./components/ComponentHoverParent');

module.exports = class extends Plugin {
  startPlugin () {
    this.components = [ 'ButtonActionComponent', 'SelectActionComponent', 'TextActionComponent', 'FormSection' ]; // i'd put this as a field but the powercord eslint config sucks

    this.loadStylesheet('style.scss');

    this.components.forEach(componentName => this.injectSCI(componentName));
  }

  pluginWillUnload () {
    this.components.forEach(componentName => uninject(this.injectionID(componentName)));
  }

  injectionID (name) {
    return `sci${name}`;
  }

  findModule (name) {
    return getModule((m) => {
      const f = m.__powercordOriginal_default ?? m.default;
      return f && f.displayName === name;
    });
  }

  async injectSCI (componentName) {
    const module = await this.findModule(componentName);

    inject(this.injectionID(componentName), module, 'default', ([ { customId } ], res) => {
      if (componentName === 'TextActionComponent' || componentName === 'FormSection') {
        res.props.children = React.createElement(componentName === 'FormSection' ? ComponentParent : ComponentHoverParent, {
          component: res.props.children,
          customID: componentName === 'FormSection' ? `Modal Custom ID: ${res.props.children.props.modal.customId}` : customId
        });
        return res;
      }

      return React.createElement(ComponentHoverParent, {
        component: res,
        customID: customId,
        componentName
      });
    });
  }
};
