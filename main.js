import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import fragmentShader from './shader/fragment.glsl';
import vertexShader from './shader/vertex.glsl';

export default class ThreeSketch {
	constructor(options) {
		this.scene = void 0;
		this.container = options.dom;
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;
		this.xSegCount = Math.ceil(this.width * 0.06);
		this.ySegCount = Math.ceil(this.height * 0.16);
		this.renderer = void 0;
		this.camera = void 0;
		this.controls = void 0;
		this.time = 0;
		this.isPlaying = true;

		this.init();
		this.addObjects();
		this.resize();
		this.render();
		this.setupResize();
	}

	init() {
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.container,
			antialias: true
		});
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.renderer.setSize(this.width, this.height);
		this.renderer.setClearColor(0xeeeeee, 1);
		this.renderer.outputEncoding = THREE.sRGBEncoding;

		this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.001, 1000);
		this.camera.position.set(0, 0, 1);
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
	}

	setupResize() {
		window.addEventListener('resize', this.resize.bind(this));
	}

	resize() {
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;
		this.renderer.setSize(this.width, this.height);
		this.camera.aspect = this.width / this.height;
		this.xSegCount = Math.ceil(this.width * 0.06);
		this.ySegCount = Math.ceil(this.height * 0.16);

		this.imageAspect = 16 / 9;
		let a1, a2;
		if (this.height / this.width > this.imageAspect) {
			a1 = (this.width / this.height) * this.imageAspect;
			a2 = 1;
		} else {
			a1 = 1;
			a2 = (this.height / this.width) * this.imageAspect;
		}

		this.material.uniforms.resolution.value.x = this.width;
		this.material.uniforms.resolution.value.y = this.height;
		this.material.uniforms.resolution.value.z = this.a1;
		this.material.uniforms.resolution.value.w = this.a2;

		this.camera.updateProjectionMatrix();
	}

	addObjects() {
		let threeSketch = this;
		this.material = new THREE.ShaderMaterial({
			extensions: { derivatives: '#extension GL_OES_standard_derivatives : enable' },
			side: THREE.DoubleSide,
			uniforms: {
				time: { value: 0 },
				resolution: { value: new THREE.Vector4() }
			},
			// wireframe: true,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader
		});

		this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

		this.mesh = new THREE.Mesh(this.geometry, this.material);
		console.log(this.geometry.attributes);
		this.scene.add(this.mesh);
	}

	addLights() {
		const light1 = new THREE.AmbientLight(0xffffff, 0.5);
		const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
		light2.position.set(0.5, 0, 0.866);
		this.scene.add(light1, light2);
	}

	stop() {
		this.isPlaying = false;
	}

	play() {
		if (!this.isPlaying) {
			this.isPlaying = true;
		}
	}

	render() {
		if (!this.isPlaying) return;
		this.time += 0.05;
		this.material.uniforms.time.value = this.time;
		requestAnimationFrame(this.render.bind(this));
		this.renderer.render(this.scene, this.camera);
	}
}

new ThreeSketch({
	dom: document.querySelector(`[data-js-controller~=Gradient]`)
});
