const canvasSketch = require("canvas-sketch");

const settings = {
	// dimensions: "A4",
	// pixelsPerInch: 300,
	// orientation: "landscape",

	// Dimensions for Instagram
	dimensions: [1080, 1080],
};

const sketch = () => {
	return ({ context, width, height }) => {
		context.fillStyle = "white";
		context.fillRect(0, 0, width, height);
		context.lineWidth = width * 0.01;

		// 10% of the canvas
		const w = width * 0.1;
		const h = height * 0.1;
		const gap = width * 0.03;
		const ix = width * 0.17;
		const iy = height * 0.17;
		const offSet = width * 0.02;
		let x, y;

		for (let i = 0; i < 5; i++) {
			for (let j = 0; j < 5; j++) {
				x = ix + (w + gap) * i;
				y = iy + (h + gap) * j;

				context.beginPath();
				context.rect(x, y, w, h);
				context.stroke();

				if (Math.random() > 0.5) {
					context.beginPath();
					context.rect(x + offSet / 2, y + offSet / 2, w - offSet, h - offSet);
					context.stroke();
				}
			}
		}
	};
};

canvasSketch(sketch, settings);
