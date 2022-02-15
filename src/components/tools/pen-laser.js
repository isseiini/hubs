const InterpolationBuffer = require("buffered-interpolation");
import { convertStandardMaterial } from "../../utils/material-utils";

import {
  SOUND_SHOOT
} from "../../systems/sound-effects-system";

import { waitForDOMContentLoaded } from "../../utils/async-utils";
import AirCanonSrc from "../../assets/models/aircanon_withgunfire_rotate2.glb";
import { loadModel } from "../gltf-model-plus";
import { cloneObject3D } from "../../utils/three-utils";

function almostEquals(epsilon, u, v) {
  return Math.abs(u.x - v.x) < epsilon && Math.abs(u.y - v.y) < epsilon && Math.abs(u.z - v.z) < epsilon;
}
let AirCanonEnvMap;
let AirCanon;

var AirCanonClip;

var ShootingSfx;

waitForDOMContentLoaded().then(() => {
  loadModel(AirCanonSrc).then(gltf => {
    AirCanon = gltf;
    //AirCanon.rotation.set(Math.PI, -Math.PI/2, Math.PI/2);
  });
});

AFRAME.registerComponent("pen-laser", {
  schema: {
    color: { type: "color", default: "#FF0033" },
    laserVisible: { default: true },
    laserInHand: { default: false },
    laserOrigin: { default: { x: 0, y: 0, z: 0 } },
    remoteLaserOrigin: { default: { x: 0, y: 0, z: 0 } },
    laserTarget: { default: { x: 0, y: 0, z: 0 } },
    action: {default: "false"}
  },

  init() {
    this.Shoot = this.Shoot.bind(this);
    this.AirCanonMesh = cloneObject3D(AirCanon.scene);
    this.AirCanonMesh.scale.set(0.06, 0.06, 0.06)
    this.el.sceneEl.setObject3D("mesh", this.AirCanonMesh);
    this.loaderMixer = new THREE.AnimationMixer(this.AirCanonMesh);
    this.loadingClip = this.loaderMixer.clipAction(this.AirCanonMesh.animations[0]);

    const environmentMapComponent2 = this.el.sceneEl.components["environment-map"];
    if (environmentMapComponent2) {
      const currentEnivronmentMap2 = environmentMapComponent2.environmentMap;
      if (AirCanonEnvMap !== currentEnivronmentMap2) {
        environmentMapComponent2.applyEnvironmentMap(this.AirCanonMesh);
        AirCanonEnvMap = currentEnivronmentMap2;
      }
    }
    
    AirCanonClip = this.loadingClip;
    ShootingSfx = this.el.sceneEl.systems["hubs-systems"].soundEffectsSystem;

    let material = new THREE.MeshStandardMaterial({ color: "red", opacity: 0.5, transparent: true, visible: true });
    const quality = window.APP.store.materialQualitySetting;
    material = convertStandardMaterial(material, quality);

    const tipMaterial = material.clone();

    const lineCurve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 2));
    const geometry = new THREE.TubeBufferGeometry(lineCurve, 2, 0.003, 8, true);
    this.laser = new THREE.Mesh(geometry, material);

    this.laserTip = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 8, 6), tipMaterial);
    this.laserTip.scale.setScalar(0.01);
    this.laserTip.matrixNeedsUpdate = true;

    const environmentMapComponent = this.el.sceneEl.components["environment-map"];
    if (environmentMapComponent) {
      environmentMapComponent.applyEnvironmentMap(this.laser);
      environmentMapComponent.applyEnvironmentMap(this.laserTip);
      environmentMapComponent.applyEnvironmentMap(this.AirCanonMesh);
    }

    //prevents the line from being a raycast target for the cursor
    this.laser.raycast = function() {};

    this.el.sceneEl.setObject3D(`pen-laser-${this.laser.uuid}`, this.laser);
    this.el.sceneEl.setObject3D(`pen-laser-tip-${this.laser.uuid}`, this.laserTip);

    this.originBuffer = new InterpolationBuffer(InterpolationBuffer.MODE_LERP, 0.1);
    this.targetBuffer = new InterpolationBuffer(InterpolationBuffer.MODE_LERP, 0.1);
  },

  update: (() => {
    

    const originBufferPosition = new THREE.Vector3();
    const targetBufferPosition = new THREE.Vector3();

    return function(prevData) {
      if (this.data.action == "true") {
        this.Shoot();
      } else {
        AirCanonClip.reset();
      }

      if (prevData.color != this.data.color) {
        this.laser.material.color.set(this.data.color);
        this.laserTip.material.color.set(this.data.color);
      }

      if (prevData.remoteLaserOrigin && !almostEquals(0.001, prevData.remoteLaserOrigin, this.data.remoteLaserOrigin)) {
        this.originBuffer.setPosition(
          originBufferPosition.set(
            this.data.remoteLaserOrigin.x,
            this.data.remoteLaserOrigin.y,
            this.data.remoteLaserOrigin.z
          )
        );
      }

      if (prevData.laserTarget && !almostEquals(0.001, prevData.laserTarget, this.data.laserTarget)) {
        this.targetBuffer.setPosition(
          targetBufferPosition.set(this.data.laserTarget.x, this.data.laserTarget.y, this.data.laserTarget.z)
        );
      }
    };
  })(),

  tick: (() => {
    const origin = new THREE.Vector3();
    const target = new THREE.Vector3();
    return function(t, dt) {
      if (this.loaderMixer && this.data.action == "true") {
        this.loaderMixer.update(dt / 1000);
        ShootingSfx.playSoundOneShot(SOUND_SHOOT);
      }

      const isMine =
        this.el.parentEl.components.networked.initialized && this.el.parentEl.components.networked.isMine();
      let laserVisible = false;

      if (isMine && this.data.laserVisible) {
        origin.copy(this.data.laserOrigin);

        if (!this.data.laserInHand) {
          // On 2d mode, shift downards
          origin.y = origin.y - 0.4;
        }

        target.copy(this.data.laserTarget);
        laserVisible = true;
      } else if (!isMine && this.data.laserVisible) {
        this.originBuffer.update(dt);
        this.targetBuffer.update(dt);
        origin.copy(this.originBuffer.getPosition());
        target.copy(this.targetBuffer.getPosition());
        laserVisible = true;
      }

      if (laserVisible) {
        //origin.y += 1;
        //origin.z += -0.5;
        this.laser.position.copy(origin.x + origin.y + origin.z);
        console.log("origin:" + origin.x + "," + origin.y + "," + origin.z)
        this.laser.lookAt(target);
        this.AirCanonMesh.position.copy(origin);
        //this.AirCanonMesh.rotation.set(Math.PI, -Math.PI/2, Math.PI/2);
        this.AirCanonMesh.lookAt(target);
        this.laser.scale.set(1, 1, origin.distanceTo(target));
        this.laser.matrixNeedsUpdate = true;
        this.laserTip.position.copy(target);
        this.laserTip.matrixNeedsUpdate = true;
      }

      if (this.laser.material.visible !== laserVisible) {
        this.laser.material.visible = laserVisible;
      }

      const laserTipVisible = laserVisible ? !(isMine && this.data.laserVisible) : false;
      if (this.laserTip.material.visible !== laserTipVisible) {
        this.laserTip.material.visible = laserTipVisible;
      }
    };
  })(),

  remove() {
    this.el.sceneEl.removeObject3D(`pen-laser-${this.laser.uuid}`);
    this.el.sceneEl.removeObject3D(`pen-laser-tip-${this.laser.uuid}`);
    this.el.sceneEl.removeObject3D("mesh");
  },

  Shoot () {
    AirCanonClip.play();
  }
});
