import * as _ from "lodash";
import { 
	LinkModel, 
	DiagramEngine, 
	PortModel as BasePortModel, 
	DefaultLinkModel 
} from "storm-react-diagrams";

export class PortModel extends BasePortModel {
	position: string | "top" | "bottom" | "left" | "right";

	constructor(pos: string = "top") {
		super(pos, "wait");
		this.position = pos;
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

	createLinkModel(): LinkModel {
		return new DefaultLinkModel();
	}
}
