const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { React, getModule } = require('powercord/webpack');

const ComponentParent = require('./components/ComponentParent');
const ComponentHoverParent = require('./components/ComponentHoverParent');

module.exports = class extends Plugin {
  startPlugin () {
    this.components = [ 'ButtonActionComponent', 'SelectActionComponent', 'TextActionComponent', 'FormSection' ]; // i'd put this as a field but the powercord eslint config sucks
    this.extraInjects = [];

    this.loadStylesheet('style.scss');

    this.components.forEach(componentName => this.injectSCI(componentName));
  }

  pluginWillUnload () {
    this.components.forEach(componentName => uninject(this.injectionID(componentName)));
    this.extraInjects.forEach(id => uninject(id));
  }

  injectionID (name) {
    return `sci${name}`;
  }

  extraInjectionID (num) {
    return `${this.injectionID('Extra')}-${num}`;
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

      if (componentName === 'SelectActionComponent') {
        inject(this.extraInjectionID(this.extraInjects.length), res.props.children[0].props.children[0].props, 'renderOptionLabel', ([ { value } ], res) => React.createElement(ComponentParent, {
          component: res,
          customID: value,
          componentName
        }));
        this.extraInjects.push(this.extraInjectionID(this.extraInjects.length));
      }

      return React.createElement(ComponentHoverParent, {
        component: res,
        customID: customId,
        componentName
      });
    });
  }
};
