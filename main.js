import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import fragmentShader from './shader/fragment.glsl';
import vertexShader from './shader/vertex.glsl';

export default class Gradient {
  constructor(options) {
    this.container = options.dom;
    this.computedCanvasStyle = getComputedStyle(this.container);
    this.isStatic = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.conf = {
      wireframe: false,
      isPlaying: true
    };
    this.t = 0;
    this.init();
  }

  init() {
    this.initScene();
    this.initMesh();
    this.resize();
    this.animate();
    window.addEventListener('resize', this.resize.bind(this));
  }

  initScene() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container,
      antialias: true
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0xffffff, 1);
    this.renderer.clearDepth = 1;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.001, 1000);
    this.camera.position.set(0, 0, 1);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.scene = new THREE.Scene();
  }

  initMaterial() {
    this.uniforms = {};
  }

  initMesh() {
    this.initMaterial();
    this.material = new THREE.ShaderMaterial({
      extensions: { derivatives: '#extension GL_OES_standard_derivatives : enable' },
      side: THREE.DoubleSide,
      uniforms: { time: { value: 0 } },
      wireframe: this.conf.wireframe,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.mesh.geometry.parameters = {
      width: this.width,
      height: this.height
    };
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  stop() {
    this.conf.isPlaying = false;
  }

  play() {
    if (!this.conf.isPlaying) {
      this.conf.isPlaying = true;
    }
  }

  animate() {
    this.t += 5e-5;
    this.mesh.material.uniforms.time.value = this.t;
    this.renderer.render(this.scene, this.camera);

    if (0 !== this.last && this.isStatic) {
      return this.renderer.render(this.scene, this.camera);
    }

    if (this.conf.isPlaying && requestAnimationFrame(this.animate.bind(this)));
  }
}

new Gradient({
  dom: document.querySelector(`[data-js-controller~=js-canvas]`)
});
