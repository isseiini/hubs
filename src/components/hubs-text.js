import createTextGeometry from "three-bmfont-text";

// 1 to match other A-Frame default widths.
const DEFAULT_WIDTH = 1;

// @bryik set anisotropy to 16. Improves look of large amounts of text when viewed from angle.
const MAX_ANISOTROPY = 16;

/**
 * Due to using negative scale, we return the opposite side specified.
 * https://github.com/mrdoob/three.js/pull/12787/
 */
function parseSide(side) {
  switch (side) {
    case "back": {
      return THREE.FrontSide;
    }
    case "double": {
      return THREE.DoubleSide;
    }
    default: {
      return THREE.BackSide;
    }
  }
}

/**
 * Determine wrap pixel count. Either specified or by experimental fudge factor.
 * Note that experimental factor will never be correct for variable width fonts.
 */
function computeWidth(wrapPixels, wrapCount, widthFactor) {
  return wrapPixels || (0.5 + wrapCount) * widthFactor;
}

AFRAME.registerComponent("text", {
  multiple: true,
  schema: {
    align: { type: "string", default: "left", oneOf: ["left", "right", "center"] },
    alphaTest: { default: 0.5 },
    // `anchor` defaults to center to match geometries.
    anchor: { default: "center", oneOf: ["left", "right", "center", "align"] },
    baseline: { default: "center", oneOf: ["top", "center", "bottom"] },
    color: { type: "color", default: "#ffffff" },
    font: { type: "string" },
    // `height` has no default, will be populated at layout.
    height: { type: "number" },
    letterSpacing: { type: "number", default: 0 },
    // `lineHeight` defaults to font's `lineHeight` value.
    lineHeight: { type: "number" },
    // `negate` must be true for fonts generated with older versions of msdfgen (white background).
    negate: { type: "boolean", default: true },
    opacity: { type: "number", default: 1.0 },
    side: { default: "front", oneOf: ["front", "back", "double"] },
    tabSize: { default: 4 },
    transparent: { default: true },
    value: { type: "string" },
    whiteSpace: { default: "normal", oneOf: ["normal", "pre", "nowrap"] },
    // `width` defaults to geometry width if present, else `DEFAULT_WIDTH`.
    width: { type: "number" },
    // `wrapCount` units are about one default font character. Wrap roughly at this number.
    wrapCount: { type: "number", default: 40 },
    // `wrapPixels` will wrap using bmfont pixel units (e.g., dejavu's is 32 pixels).
    wrapPixels: { type: "number" },
    // `xOffset` to add padding.
    xOffset: { type: "number", default: 0 },
    // `zOffset` will provide a small z offset to avoid z-fighting.
    zOffset: { type: "number", default: 0.001 }
  },

  init: function() {
    const shaderData = this.getShaderData(this.data);
    this.shaderObject = new AFRAME.shaders["msdf"].Shader();
    this.shaderObject.el = this.el;
    this.shaderObject.init(shaderData);
    this.shaderObject.update(shaderData);
    this.shaderObject.material.transparent = shaderData.transparent; // Apparently, was not set on `init` nor `update`.
    this.shaderObject.material.side = shaderData.side;
    this.geometry = createTextGeometry();
    this.mesh = new THREE.Mesh(this.geometry, this.shaderObject.material);
    this.el.setObject3D(this.attrName, this.mesh);
    //this.color = document.documentElement.style.getPropertyValue("--team-color");
  },

  update: function(oldData) {
    const data = this.data;
    const shaderData = this.getShaderData(this.data);
    this.shaderObject.update(shaderData);
    this.shaderObject.material.transparent = shaderData.transparent; // Apparently, was not set on `init` nor `update`.
    this.shaderObject.material.side = shaderData.side;
  },

  /**
   * Clean up geometry, material, texture, mesh, objects.
   */
  remove: function() {
    this.geometry.dispose();
    this.geometry = null;
    this.el.removeObject3D(this.attrName);
    this.shaderObject.material.dispose();
    this.shaderObject.material = null;
    delete this.shaderObject;
  },

  getShaderData: (function() {
    const shaderData = {};
    return function(data) {
      shaderData.alphaTest = data.alphaTest;
      shaderData.color = data.color;
      shaderData.opacity = data.opacity;
      shaderData.side = parseSide(data.side);
      shaderData.transparent = data.transparent;
      shaderData.negate = data.negate;
      return shaderData;
    };
  })()
});
