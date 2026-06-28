/* Background particle field disabled for now (per design pass).
 * Keep the same API as no-ops so the rest of the app stays decoupled —
 * flip this back on later by restoring the canvas animation here. */
window.SYNAPSE_NEURONS = {
  fire: function () {},
  burst: function () {},
  setIntensity: function () {}
};
