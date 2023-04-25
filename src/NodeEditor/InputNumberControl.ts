import { Control, Node, NodeEditor } from 'rete';
import InputNumberField from './components/InputNumberField';

type ControlInternalProps = {
  value?: number | null;
  onChange: (value: number | null) => void;
};

export default class InputNumberControl extends Control {
  static component = InputNumberField;

  emitter: NodeEditor | null;
  component: typeof InputNumberField;
  props: ControlInternalProps;

  // `update` function for control is defined when event "rendercontrol"
  // so `update` function may be undefined at the initial stage of page loading
  // https://github.com/retejs/rete/blob/master/src/view/control.ts#L9
  // https://github.com/retejs/react-render-plugin/blob/master/src/index.jsx#L25
  update: () => void = () => {};

  constructor(emitter: NodeEditor | null, key: string, node: Node, props = {}) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = InputNumberControl.component;

    const initial = node.data[key] as number;

    this.props = {
      ...props,
      value: initial,
      onChange: (v) => {
        this.setValue(v);
        this.emitter?.trigger('process');
      },
    };
  }

  setValue(val: number | null) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }

  getValue() {
    return this.getData(this.key);
  }
}
