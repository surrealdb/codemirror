import { NodeProp } from '@lezer/common';

export const since = new NodeProp({
	perNode: false,
	deserialize(str) {
		return str.replace(/_/g, '.').toLowerCase();
	},
});

export const until = new NodeProp({
	perNode: false,
	deserialize(str) {
		return str.replace(/_/g, '.').toLowerCase();
	},
});
