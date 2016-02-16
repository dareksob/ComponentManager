"use strict";
var ComponentManager = function() {
  function ComponentManager() {
    this.path = 'components/';
    this.detectAttr = 'data-components';
    this.settingAttr = 'data-settings';
    this.splitSeperator = ',';
    this.observers = {};
  }
  return ($traceurRuntime.createClass)(ComponentManager, {
    setup: function(setting) {
      var $__2 = this;
      var keys = Object.keys(setting);
      keys.forEach(function(property) {
        if (typeof $__2[property] === 'string') {
          $__2[property] = setting[property];
        }
      });
      return this;
    },
    on: function(eventName, callback) {
      if (!this.observers[eventName]) {
        this.observers[eventName] = [];
      }
      this.observers[eventName].push(callback);
      return this;
    },
    trigger: function(eventName, payload) {
      if (this.observers[eventName]) {
        this.observers[eventName].forEach(function(callback) {
          callback(payload);
        });
      }
      return this;
    },
    getComponentNodes: function(root) {
      return root.querySelectorAll(("[" + this.detectAttr + "]"));
    },
    getNodesOfComponent: function(componentName) {
      var root = arguments[1] !== (void 0) ? arguments[1] : document;
      var $__2 = this;
      var nodes = this.getComponentNodes(root);
      var match = new RegExp(("^" + componentName + ",|^" + componentName + "|," + componentName));
      nodes = Array.prototype.filter.call(nodes, function(node) {
        return match.test(node.getAttribute($__2.detectAttr));
      });
      return nodes;
    },
    detect: function(root) {
      var $__2 = this;
      return new Promise(function(resolve, reject) {
        var nodes = $__2.getComponentNodes(root);
        var index = nodes.length;
        var $__3 = function() {
          var node = nodes[index];
          var components = node.getAttribute($__2.detectAttr).split($__2.splitSeperator);
          var settings = {};
          if (node.hasAttribute($__2.settingAttr)) {
            settings = JSON.parse(node.getAttribute($__2.settingAttr));
          }
          components.forEach(function(name) {
            var setting = settings && settings.hasOwnProperty(name) ? settings[name] : {};
            var path = ("" + $__2.path + name);
            $__2.trigger('AddComponent', {
              node: node,
              name: name,
              path: path,
              setting: setting
            });
          });
        };
        while (index--) {
          $__3();
        }
        resolve(nodes);
      });
    }
  }, {});
}();
var $__default = ComponentManager;
Object.defineProperties(module.exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});
