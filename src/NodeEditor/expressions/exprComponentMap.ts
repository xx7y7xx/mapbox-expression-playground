import ExprComponent from './ExprComponent';
import exprConfigMap from './exprConfigMap';

// Define the object that maps the exported component classes
const exprComponentMap: { [exprName: string]: new () => ExprComponent } = {};

// Create component classes in a loop
Object.keys(exprConfigMap).forEach((exprName) => {
  const ec = exprConfigMap[exprName];

  const component = class extends ExprComponent {
    constructor() {
      super(exprName);
    }

    // component uniq key, every components include expression components will have a key
    static key = exprName;
    exprName = exprName;

    config = {
      inputs: ec.inputs,
      outputs: ec.outputs,
    };
  };

  // Add the component class to the map object
  exprComponentMap[exprName] = component;
});

export default exprComponentMap;
