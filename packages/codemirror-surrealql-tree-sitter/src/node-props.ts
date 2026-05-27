import {
	continuedIndent,
	foldInside,
	foldNodeProp,
	indentNodeProp,
} from "@codemirror/language";
import { NodeProp } from "@lezer/common";
import type { NodeSet } from "@lezer/common";

/** Extend node set with indent/fold/bracket props for SurrealQL tree shapes. */
export function extendNodeSet(base: NodeSet): NodeSet {
	return base.extend(
		indentNodeProp.add({
			Object: continuedIndent({ except: /^\s*}/ }),
			Block: continuedIndent({ except: /^\s*}/ }),
			Array: continuedIndent({ except: /^\s*]/ }),
		}),
		foldNodeProp.add({
			"Object Block Array CombinedResult": foldInside,
		}),
		NodeProp.openedBy.add({
			BraceOpen: ["BraceClose"],
			"[": ["]"],
			"<": [">"],
			"(": [")"],
		}),
		NodeProp.closedBy.add({
			BraceClose: ["BraceOpen"],
			"]": ["["],
			">": ["<"],
			")": ["("],
		}),
	);
}
