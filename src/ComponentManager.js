/**
 * ComponentManager
 *
 * @author darius sobczak<mail@dsobczak.de>
 */
class ComponentManager {
  /**
   * constructor
   */
  constructor() {
    this.path = 'components/';
    this.detectAttr = 'data-components';
    this.settingAttr = 'data-settings';
    this.splitSeperator = ',';
    this.observers = {};
  }

  /**
   * setup manager by map
   *
   * @param {object} setting key value map
   * @returns {ComponentManager}
   */
  setup(setting) {
    const keys = Object.keys(setting);
    keys.forEach((property) => {
      if (typeof this[property] === 'string') {
        this[property] = setting[property];
      }
    });

    return this;
  }

  /**
   * listener registration
   *
   * @param eventName
   * @param callback
   * @returns {ComponentManager}
   */
  on(eventName, callback) {
    if ( ! this.observers[eventName]) {
      this.observers[eventName] = [];
    }
    this.observers[eventName].push(callback);

    return this;
  }

  /**
   * trigger event
   *
   * @param eventName
   * @param payload
   * @returns {ComponentManager}
   */
  trigger(eventName, payload) {
    if (this.observers[eventName]) {
      this.observers[eventName].forEach((callback) => {
        callback(payload);
      });
    }

    return this;
  }

  /**
   * @param root
   * @returns {NodeList}
   */
  getComponentNodes(root) {
    return root.querySelectorAll(`[${this.detectAttr}]`);
  }

  /**
   * return all nodes that implement the component
   *
   * @param componentName
   * @param root
   * @returns {NodeList}
   */
  getNodesOfComponent(componentName, root = document) {
    let nodes = this.getComponentNodes(root);
    let match = new RegExp(`^${componentName},|^${componentName}|,${componentName}`);

    // filter nodes only by component
    nodes = Array.prototype.filter.call(nodes, (node) => {
      return match.test(node.getAttribute(this.detectAttr));
    });

    return nodes;
  }

  /**
   * detect all components in root
   *
   * @param root
   * @returns {Promise}
   */
  detect(root) {
    return new Promise((resolve, reject) => {
      const nodes = this.getComponentNodes(root);
      let index = nodes.length;

      while(index--) {
        let node = nodes[index];
        let components = node
          .getAttribute(this.detectAttr)
          .split(this.splitSeperator);
        let settings = {};

        // parse setting
        if (node.hasAttribute(this.settingAttr)) {
          settings = JSON.parse(node.getAttribute(this.settingAttr));
        }

        components.forEach((name) => {
          const setting = settings && settings.hasOwnProperty(name)
            ? settings[name]
            : {};
          const path = `${this.path}${name}`;

          this.trigger('AddComponent', {node, name, path, setting});
        });
      }

      resolve(nodes);
    });
  }
}

export default ComponentManager;