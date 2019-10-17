import { NodeModel as BaseNodeModel } from 'storm-react-diagrams';
import * as _ from 'lodash';
import { PortModel } from './PortModel';

export class NodeModel extends BaseNodeModel {
  constructor(element) {
    super('goal', element.id);

    this.name = element.name;
    this.selectedGoals = element.selectedGoals;
    this.timeoutTime = element.timeoutTime;
    this.timeoutUnit = element.timeoutUnit;

    this.addPort(new PortModel('left'));
    this.addPort(new PortModel('bottom'));
    this.addPort(new PortModel('right'));
  }

  deSerialize(ob, engine) {
    super.deSerialize(ob, engine);
    this.name = ob.name;
    this.selectedGoals = ob.selectedGoals;
    this.timeoutTime = ob.timeoutTime || '';
    this.timeoutUnit = ob.timeoutUnit || 'days';
  }

  serialize() {
    return _.merge(super.serialize(), {
      name: this.name,
      selectedGoals: this.selectedGoals,
      timeoutTime: this.timeoutTime,
      timeoutUnit: this.timeoutUnit,
    });
  }
}
