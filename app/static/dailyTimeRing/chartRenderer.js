/**********************************************************
 * DAILY TIME RING – RENDERER
 * --------------------------------------------------------
 * Pure D3 rendering layer.
 *
 * Knows nothing about:
 * - Fetching
 * - Database
 * - Sessions
 *
 * Only draws what it receives.
 **********************************************************/

export function createChartRenderer(containerSelector) {

  /* ======================================================
  * CONFIG / DIMENSIONS
  * ====================================================== */

  const WIDTH = 400;
  const HEIGHT = 400;
  const RADIUS = Math.min(WIDTH, HEIGHT) / 2;

  /* ======================================================
  * SVG SETUP
  * ====================================================== */

  const svg = d3
    .select(containerSelector)
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .append("g")
    .attr("transform", `translate(${WIDTH / 2}, ${HEIGHT / 2})`);

  /* ======================================================
  * CENTER CONTENT (clock / status / later: timer, buttons)
  * ====================================================== */

  const centerGroup = svg
    .append("g")
    .attr("class", "center-content")
    .attr("text-anchor", "middle");

  // Clock (HH:MM)
  const clockText = centerGroup
    .append("text")
    .attr("y", -5)
    .attr("font-size", "28px")
    .attr("font-weight", "600")
    .attr("fill", "#111");

  // Status (FOCUSING / IDLE)
  const statusText = centerGroup
    .append("text")
    .attr("y", 22)
    .attr("font-size", "12px")
    .attr("letter-spacing", "1px")
    .attr("fill", "#666");

  /* ======================================================
  * ARC GENERATOR
  * ====================================================== */

  // Converts { startAngle, endAngle } → SVG path
  const arc = d3
    .arc()
    .innerRadius(RADIUS * 0.6)
    .outerRadius(RADIUS * 0.9);


  /* ======================================================
  * RING RENDERING
  * ====================================================== */

  // Initial draw with startup animation
  function drawRing(angleSegments) {
    svg
      .selectAll("path")
      .data(angleSegments)
      .enter()
      .append("path")
      .attr("fill", d => d.color)
      .each(function (d) {
        // Start collapsed
        this._current = {
          startAngle: d.startAngle,
          endAngle: d.startAngle
        };
      })
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate(this._current, d);
        return t => arc(interpolate(t));
      });
  }

  // Live update (no animation)
  function updateRing(angleSegments) {
    svg
      .selectAll("path")
      .data(angleSegments)
      .attr("fill", d => d.color)
      .attr("d", arc);
  }

  function updateCenter(clock, status) {
    clockText.text(clock);
    statusText.text(status);
  }

  return{
    drawRing,
    updateRing,
    updateCenter
  }
}