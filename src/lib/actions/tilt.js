import VanillaTilt from 'vanilla-tilt';
export function tilt(node, options) {
	const defaults = {
		max: 0
	};
	const settings = { ...defaults, ...options };
	VanillaTilt.init(node, settings);
	return {
		destroy() {
			if (node.vanillaTilt) {
				node.vanillaTilt.destroy();
			}
		}
	};
}