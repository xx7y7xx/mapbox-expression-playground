import ExprComponent from './ExprComponent';
import exprConfigs from './configs';

// Define the object that maps the exported component classes
const componentMap: { [key: string]: new () => ExprComponent } = {};

// Create component classes in a loop
exprConfigs.forEach((ec) => {
  const component = class extends ExprComponent {
    constructor() {
      super(ec.expr);
    }

    static key = ec.expr;
    expr = ec.expr;

    inputs = ec.inputs;
    outputs = ec.outputs;
  };
  // Add the component class to the map object
  componentMap[ec.expr] = component;
});

export default componentMap;
