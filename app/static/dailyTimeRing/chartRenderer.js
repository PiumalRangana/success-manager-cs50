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

  // Stop timer button
  const stopButton = centerGroup
    .append("rect")
    .attr("x", -30)
    .attr("y", 40)
    .attr("width", 60)
    .attr("height", 30)
    .attr("fill", "#ff4444")
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("display", "none") // Hidden by default
    .attr("cursor", "pointer")
    .on("click", () => {
      // Placeholder for stop timer action
      stopTimer();
    });

  const stopButtonText = centerGroup
    .append("text")
    .attr("y", 60)
    .attr("font-size", "14px")
    .attr("fill", "#fff")
    .text("STOP")
    .attr("display", "none") // Hidden by 
    .attr("cursor", "pointer")
    .on("click", () => {
      // Placeholder for stop timer action
      stopTimer();
    });

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

  function updateCenter(clock, status, showStopButton) {
    clockText.text(clock);
    statusText.text(status);
    stopButton.style("display", showStopButton ? "block" : "none");
    stopButtonText.style("display", showStopButton ? "block" : "none");
  }

  return{
    drawRing,
    updateRing,
    updateCenter
  }
}