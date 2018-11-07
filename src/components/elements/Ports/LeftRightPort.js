import * as _ from "lodash";
import { 
	LinkModel as BaseLinkModel, 
	DiagramEngine, 
	PortModel as BasePortModel, 
	// DefaultLinkModel 
} from "storm-react-diagrams";

import { LinkModel } from './../Link';

export class LeftRightPort extends BasePortModel {
	in: boolean;
	position: string | "left" | "right";

	constructor(pos: string = "left", type: string) {
        super(pos, type);
        
		this.position = pos;
		this.in = this.position ===  "left";
	}
	
	link(port: BasePortModel): BaseLinkModel {
		let link = this.createLinkModel();

		link.setSourcePort(this);
		link.setTargetPort(port);

		return link;
	}

	canLinkToPort(port: BasePortModel): boolean {
		return this.in !== port.in;
	}

	serialize() {
		return _.merge(super.serialize(), {
			position: this.position
		});
	}

	deSerialize(data: any, engine: DiagramEngine) {
		super.deSerialize(data, engine);
		this.position = data.position;
	}

	createLinkModel(): BaseLinkModel {
		return new LinkModel();
	}
}