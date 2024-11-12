import { NodeProp } from '@lezer/common';

export const surqlVersion = new NodeProp({
	perNode: false,
	deserialize(str) {
		return str.replace(/_/g, '.').toLowerCase();
	},
});
