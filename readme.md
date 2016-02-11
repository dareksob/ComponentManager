# ComponentManager
Manage your enviroment nodes to inizalize.
ComponentManager is written in EcmaScript6 standard, your can use es5 version.

## info for JSPM
Use the github implementation
jspm install github:dareksob/componentmanager

npm not work at the moment

## minimum system enviroment
- Promise API
- document.querySelectorAll

Example Markup
``````````
<button class="simple-button" data-components="button">label</button>

<div data-components="button,mycomponent" data-settings='{"button": {}, "mycomponent": {}}'></div>

``````````

Run
``````````
var cm = new ComponentManager();

// setup properties before start detection
cm.setup({PROPERTY:VALUE});

cm
// require event, will triggerd after found components
      .on('AddComponent', function (event) {
// EXAMPLE with Systemjs loader and flightjs components
        return System
          .import(event.path)
          .then(function (pack) {
            return pack.default;
          })
          .then(function (component) => {
            var componentNode = component.attachTo(event.node, event.setting);
          });
      })
// detect start by document as root 
      .detect(document)
// promise interface after done make the next step
      .then(function (nodes) {
        // all component found and initialize
      });
``````````

## documentation
All handling based on promises objects, after detection you can play with a ready system.
Each function return a valid value it follow the fluid code conzept

### properties (options)

#### path
(default  'components/')
prefixed script paths could be empty script

#### detectAttr
(default 'data-components')
detection attribute of nodes

#### settingAttr
(default 'data-settings')
optional attribute for setting definition(JSON script)

#### splitSeperator
(default ',')
used for multi definition if components
Example: data-components="comp1,comp2"


### Methode

#### on(eventName, callback)
listener registration
@param eventName
@param callback
@returns {ComponentManager}

#### setup(setting)
setup manager by map
@param setting
@returns {ComponentManager}


#### getComponentNodes(root)
return all component nodes in root
@param root
@returns {NodeList}

#### getNodesOfComponent(componentName, root = document)
return all nodes that implement the component
@param componentName
@param root
@returns {NodeList}

#### detect(root)
detect all components in root
@param root
@returns {Promise}


## Events

#### AddComponent
Will trigger after detection and parsing all information for this component
Event data has information about this component
{
    node = DOM Node 
    name = component name, 
    path = path to component, 
    setting = detected setting
}
