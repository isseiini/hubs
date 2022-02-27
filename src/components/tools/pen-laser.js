const InterpolationBuffer = require("buffered-interpolation");
import { convertStandardMaterial } from "../../utils/material-utils";

import {
  SOUND_SHOOT
} from "../../systems/sound-effects-system";

import { waitForDOMContentLoaded } from "../../utils/async-utils";
import AirCanonSrc from "../../assets/models/aircanon_withgunfire_rotate2.glb";
import { loadModel } from "../gltf-model-plus";
import { cloneObject3D } from "../../utils/three-utils";

import { paths } from "../../systems/userinput/paths";
import { getLastWorldPosition, getLastWorldQuaternion } from "../../utils/three-utils";

function almostEquals(epsilon, u, v) {
  return Math.abs(u.x - v.x) < epsilon && Math.abs(u.y - v.y) < epsilon && Math.abs(u.z - v.z) < epsilon;
}
let AirCanonEnvMap;
let AirCanon;

var AirCanonClip;

var ShootingSfx;

const pathsMap = {
  "player-right-controller": {
    startDrawing: paths.actions.rightHand.startDrawing,
    stopDrawing: paths.actions.rightHand.stopDrawing,
    undoDrawing: paths.actions.rightHand.undoDrawing,
    switchDrawMode: paths.actions.rightHand.switchDrawMode,
    penNextColor: paths.actions.rightHand.penNextColor,
    penPrevColor: paths.actions.rightHand.penPrevColor,
    scalePenTip: paths.actions.rightHand.scalePenTip
  },
  "player-left-controller": {
    startDrawing: paths.actions.leftHand.startDrawing,
    stopDrawing: paths.actions.leftHand.stopDrawing,
    undoDrawing: paths.actions.leftHand.undoDrawing,
    switchDrawMode: paths.actions.leftHand.switchDrawMode,
    penNextColor: paths.actions.leftHand.penNextColor,
    penPrevColor: paths.actions.leftHand.penPrevColor,
    scalePenTip: paths.actions.leftHand.scalePenTip
  },
  "right-cursor": {
    pose: paths.actions.cursor.right.pose,
    startDrawing: paths.actions.cursor.right.startDrawing,
    stopDrawing: paths.actions.cursor.right.stopDrawing,
    undoDrawing: paths.actions.cursor.right.undoDrawing,
    penNextColor: paths.actions.cursor.right.penNextColor,
    penPrevColor: paths.actions.cursor.right.penPrevColor,
    scalePenTip: paths.actions.cursor.right.scalePenTip
  },
  "left-cursor": {
    pose: paths.actions.cursor.left.pose,
    startDrawing: paths.actions.cursor.left.startDrawing,
    stopDrawing: paths.actions.cursor.left.stopDrawing,
    undoDrawing: paths.actions.cursor.left.undoDrawing,
    penNextColor: paths.actions.cursor.left.penNextColor,
    penPrevColor: paths.actions.cursor.left.penPrevColor,
    scalePenTip: paths.actions.cursor.left.scalePenTip
  }
};


waitForDOMContentLoaded().then(() => {
  loadModel(AirCanonSrc).then(gltf => {
    AirCanon = gltf;
    //AirCanon.rotation.set(Math.PI, -Math.PI/2, Math.PI/2);
  });
  
});

AFRAME.registerComponent("aircanon-animation", {
  schema: {
    action: { default : "false" }
  },

  init() {
    //this.aircanon_target = AFRAME.scenes[0].systems.userinput.get(pathsMap[this.grabberId].pose);
    console.log(this.aircanon_target);
    //this.Shoot = this.Shoot.bind(this);
    this.AirCanonMesh = cloneObject3D(AirCanon.scene);
    ///this.AirCanonMesh.scale.set(0.06, 0.06, 0.06)
    this.el.sceneEl.setObject3D("mesh", this.AirCanonMesh);
    this.loaderMixer = new THREE.AnimationMixer(this.AirCanonMesh);
    this.loadingClip = this.loaderMixer.clipAction(this.AirCanonMesh.animations[0]);

    AirCanonClip = this.loadingClip;
    ShootingSfx = this.el.sceneEl.systems["hubs-systems"].soundEffectsSystem;

  },

  update() {
    if (this.data.action == "true") {
      AirCanonClip.play();
      AirCanonClip.reset();
    } else {
      //var current_animation = this.loaderMixer.existingAction(this.AirCanonMesh.animations[0]);
      //current_animation.reset();
      AirCanonClip.stop();
    }
  },

  tick(t, dt) {
    if (this.loaderMixer && this.data.action == "true") {
      this.loaderMixer.update(dt / 1000);
      ShootingSfx.playSoundOneShot(SOUND_SHOOT);
    }
    const aircanon_target_cursor = AFRAME.scenes[0].systems.userinput.get(paths.actions.rightHand.pose) || AFRAME.scenes[0].systems.userinput.get(paths.actions.leftHand.pose);
    const aircanon_target = this._getIntersection(aircanon_target_cursor);
    this.AirCanonMesh.lookAt(aircanon_target);
  },

  _getIntersection: (() => {
    const rawIntersections = [];
    const worldQuaternion = new THREE.Quaternion();
    return function(cursorPose) {
      rawIntersections.length = 0;

      if (aircanon_target) {
        this.raycaster.ray.origin.copy(cursorPose.position);
        this.raycaster.ray.direction.copy(cursorPose.direction);
      } else if (this.grabberId !== null) {
        getLastWorldPosition(this.el.parentEl.object3D, this.raycaster.ray.origin);
        getLastWorldQuaternion(this.el.parentEl.object3D, worldQuaternion);
        this.raycaster.ray.direction.set(0, -1, 0);
        this.raycaster.ray.direction.applyQuaternion(worldQuaternion);
      }

      if (this.grabberId !== null) {
        this.raycaster.intersectObjects(this.targets, true, rawIntersections);
        return rawIntersections[0];
      }
      
      return null;
    };
  })()
});

AFRAME.registerComponent("pen-laser", {
  schema: {
    color: { type: "color", default: "#FF0033" },
    laserVisible: { default: true },
    laserInHand: { default: false },
    laserOrigin: { default: { x: 0, y: 0, z: 0 } },
    remoteLaserOrigin: { default: { x: 0, y: 0, z: 0 } },
    laserTarget: { default: { x: 0, y: 0, z: 0 } },
    ///action: {default: "false"}
  },

  init() {
    //this.Shoot = this.Shoot.bind(this);
    /*this.AirCanonMesh = cloneObject3D(AirCanon.scene);
    this.AirCanonMesh.scale.set(0.06, 0.06, 0.06)
    this.el.sceneEl.setObject3D("mesh", this.AirCanonMesh);
    this.loaderMixer = new THREE.AnimationMixer(this.AirCanonMesh);
    this.loadingClip = this.loaderMixer.clipAction(this.AirCanonMesh.animations[0]);*/

    const environmentMapComponent2 = this.el.sceneEl.components["environment-map"];
    /*if (environmentMapComponent2) {
      const currentEnivronmentMap2 = environmentMapComponent2.environmentMap;
     
      environmentMapComponent2.applyEnvironmentMap(this.AirCanonMesh);
    }*/
    
    /*AirCanonClip = this.loadingClip;
    ShootingSfx = this.el.sceneEl.systems["hubs-systems"].soundEffectsSystem;*/

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
      ///environmentMapComponent.applyEnvironmentMap(this.AirCanonMesh);
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
      /*if (this.data.action == "true") {
        AirCanonClip.play();
        AirCanonClip.reset();
      } else {
        //var current_animation = this.loaderMixer.existingAction(this.AirCanonMesh.animations[0]);
        //current_animation.reset();
        AirCanonClip.stop();
      }*/

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
      /*if (this.loaderMixer && this.data.action == "true") {
        this.loaderMixer.update(dt / 1000);
        ShootingSfx.playSoundOneShot(SOUND_SHOOT);
      }*/

      const isMine =
        this.el.parentEl.components.networked.initialized && this.el.parentEl.components.networked.isMine();
      let laserVisible = false;

      if (isMine && this.data.laserVisible) {
        origin.copy(this.data.laserOrigin);

        if (!this.data.laserInHand) {
          // On 2d mode, shift downards
          origin.y = origin.y - 0.09;
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
        /*origin.x = origin.x - 0.35;
        origin.y = origin.y + 0.27;
        origin.z = origin.z - 0.17;*/
        this.laser.position.copy(origin);
        this.laser.lookAt(target);
        /*this.AirCanonMesh.position.copy(origin);
        this.AirCanonMesh.lookAt(target);
        this.AirCanonMesh.matrixNeedsUpdate = true;*/
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
  }

  /*Shoot () {
    AirCanonClip.play();
  }*/
});
