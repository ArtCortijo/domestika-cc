const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

const settings = {
	dimensions: [1080, 1080],
};
let manager;

let text = "A";
let fontSize = 1200;
let fontFamily = "serif";

const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");

const sketch = ({ context, width, height }) => {
	const cell = 20;
	const cols = Math.floor(width / cell);
	const rows = Math.floor(height / cell);
	const numCells = cols * rows;

	typeCanvas.width = cols;
	typeCanvas.height = rows;

	return ({ context, width, height }) => {
		typeContext.fillStyle = "black";
		typeContext.fillRect(0, 0, cols, rows);

		fontSize = cols * 1.2;

		typeContext.fillStyle = "white";
		// https://www.w3schools.com/tags/canvas_font.asp
		typeContext.font = `${fontSize}px ${fontFamily}`;
		// https://www.w3schools.com/tags/canvas_textbaseline.asp
		typeContext.textBaseline = "top";
		// https://www.w3schools.com/tags/canvas_textalign.asp
		// typeContext.textAlign = "center";

		const metrics = typeContext.measureText(text);
		const metricX = metrics.actualBoundingBoxLeft * -1;
		const metricY = metrics.actualBoundingBoxAscent * -1;
		const metricW =
			metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
		const metricH =
			metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

		const tx = (cols - metricW) * 0.5 - metricX;
		const ty = (rows - metricH) * 0.5 - metricY;

		typeContext.save();
		typeContext.translate(tx, ty);
		typeContext.beginPath();
		typeContext.rect(metricX, metricY, metricW, metricH);
		typeContext.stroke();
		// typeContext.translate(cols * 0.5, rows * 0.5);
		// https://www.w3schools.com/tags/canvas_filltext.asp
		typeContext.fillText(text, 0, 0);
		typeContext.restore();

		// https://www.w3schools.com/tags/canvas_getimagedata.asp
		const typeData = typeContext.getImageData(0, 0, cols, rows).data;

		context.fillStyle = "black";
		context.fillRect(0, 0, width, height);

		context.textBaseline = "middle";
		context.textAlign = "center";

		// context.drawImage(typeCanvas, 0, 0);

		for (let i = 0; i < numCells; i++) {
			const col = i % cols;
			const row = Math.floor(i / cols);

			const x = col * cell;
			const y = row * cell;

			const r = typeData[i * 4 + 0];
			const g = typeData[i * 4 + 1];
			const b = typeData[i * 4 + 2];
			const a = typeData[i * 4 + 3];

			const glyph = getGlyph(r);

			context.font = `${cell * 2}px ${fontFamily}`;
			if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;

			// context.fillStyle = `rgb(${r},${g},${b})`;
			context.fillStyle = "white";

			context.save();
			context.translate(x, y);
			context.translate(cell * 0.5, cell * 0.5);

			context.fillText(glyph, 0, 0);

			// Squares
			// context.fillRect(0, 0, cell, cell);

			// Circles
			// context.translate(cell * 0.5, cell * 0.5);
			// context.beginPath();
			// context.arc(0, 0, cell * 0.5, 0, Math.PI * 2);
			// context.fill();

			context.restore();
		}
	};
};

const getGlyph = (value) => {
	if (value < 50) return "";
	if (value < 100) return ".";
	if (value < 150) return "-";
	if (value < 200) return "+";
	if (value < 250) return "art";

	const glyphs = "_= /".split("");

	return random.pick(glyphs);
};

const onKeyUp = (e) => {
	text = e.key.toUpperCase();
	manager.render();
};

document.addEventListener("keyup", onKeyUp);

const start = async () => {
	manager = await canvasSketch(sketch, settings);
};

start();
