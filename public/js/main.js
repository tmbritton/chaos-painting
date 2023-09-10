/**
 * Set up the canvas, variables, event listeners, etc.
 * @returns {{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D}}
 */
const setup = () => {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("app");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  /** @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext("2d");
  return { canvas, ctx };
};

/**
 * Process user input and update the state of the artwork
 */
function update() {}

/**
 * Draw the current state of the artwork on the canvas
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 */
function draw(canvas, context) {
  // Draw the current state of the artwork on the canvas
}

/**
 * Application main loop.
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 */
const main = (canvas, ctx) => {
  update();
  draw(canvas, ctx);
  requestAnimationFrame(() => main(canvas, ctx));
};

window.addEventListener("load", () => {
  const { canvas, ctx } = setup();
  main(canvas, ctx);
});
