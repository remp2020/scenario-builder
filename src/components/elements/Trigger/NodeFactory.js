import * as React from 'react';
import { AbstractNodeFactory } from '@projectstorm/react-diagrams';

import NodeWidget from './NodeWidget';
import { NodeModel } from './NodeModel';

export class NodeFactory extends AbstractNodeFactory {
  constructor() {
    super('trigger');
  }

  generateReactWidget(diagramEngine, node) {
    return (
      <NodeWidget
        diagramEngine={diagramEngine}
        node={node}
        classBaseName='square-node'
        className='trigger-node'
      />
    );
  }

  getNewInstance() {
    return new NodeModel();
  }
}
