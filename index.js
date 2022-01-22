const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { React, getModule } = require('powercord/webpack');

const ComponentParent = require('./components/ComponentParent');

module.exports = class extends Plugin {
  startPlugin () {
    this.components = [ 'ButtonActionComponent', 'SelectActionComponent' ]; // i'd put this as a field but the powercord eslint config sucks

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

    inject(this.injectionID(componentName), module, 'default', ([ { customId } ], res) =>
      React.createElement(ComponentParent, {
        component: res,
        customID: customId,
        componentName
      })
    );
  }
};
