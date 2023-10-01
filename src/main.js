import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { GUI } from "lil-gui";

window.addEventListener("load", function () {
  init();
});

async function init() {
  gsap.registerPlugin(ScrollTrigger);

  const params = {
    waveColor: "#00ffff",
    backgroundColor: "#ffffff",
    fogColor: "#f0f0f0",
  };

  const canvas = document.querySelector("#canvas");

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas,
  });

  renderer.shadowMap.enabled = true;

  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  scene.fog = new THREE.Fog(0xf0f0f0, 0.1, 500);
  // scene.fog = new THREE.FogExp2(0xf0f0f0, 0.005);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500
  );

  camera.position.set(0, 25, 150);

  const waveGeometry = new THREE.PlaneGeometry(1500, 1500, 150, 150);
  const waveMaterial = new THREE.MeshStandardMaterial({
    color: params.waveColor,
  });

  const wave = new THREE.Mesh(waveGeometry, waveMaterial);

  wave.rotation.x = -Math.PI / 2;
  wave.receiveShadow = true;

  const waveHeight = 2.5;
  const initialZPosition = [];

  for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
    const z =
      waveGeometry.attributes.position.getZ(i) +
      (Math.random() - 0.5) * waveHeight;

    waveGeometry.attributes.position.setZ(i, z);
    initialZPosition.push(z);
  }

  wave.update = function () {
    const elapsedTime = clock.getElapsedTime();

    for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
      const z =
        initialZPosition[i] + Math.sin(elapsedTime * 3 + i ** 2) * waveHeight;

      waveGeometry.attributes.position.setZ(i, z);
    }

    waveGeometry.attributes.position.needsUpdate = true;
  };

  scene.add(wave);

  const loader = new GLTFLoader();

  const gltf = await loader.loadAsync("./models/ship/scene.gltf");
  const gltf2 = await loader.loadAsync("./models/asian_pirate_ship/scene.gltf");
  const gltf3 = await loader.loadAsync("./models/viking_ship/scene.gltf");

  const ship = gltf.scene;
  const asianShip = gltf2.scene;
  const vikingShip = gltf3.scene;

  ship.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
    }
  });

  asianShip.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
    }
  });

  vikingShip.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
    }
  });

  ship.castShadow = true;
  asianShip.castShadow = true;
  vikingShip.castShadow = true;

  ship.update = function () {
    const elapsedTime = clock.getElapsedTime();

    ship.position.y = Math.sin(elapsedTime * 3);
    asianShip.position.y = Math.sin(elapsedTime * 3);
    vikingShip.position.y = Math.sin(elapsedTime * 3);
  };

  ship.scale.set(40, 40, 40);
  ship.rotation.y = Math.PI;

  asianShip.scale.set(40, 40, 40);
  asianShip.position.set(70, 0, -50);
  asianShip.rotation.y = -Math.PI / 13;

  vikingShip.scale.set(4, 4, 4);
  vikingShip.position.set(-65, 0, -50);
  vikingShip.rotation.y = Math.PI;

  scene.add(ship);
  scene.add(asianShip);
  scene.add(vikingShip);

  const pointLight = new THREE.PointLight(0xffffff, 1);

  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 1024;
  pointLight.shadow.mapSize.height = 1024;
  pointLight.shadow.radius = 10;

  pointLight.position.set(15, 15, 15);

  scene.add(pointLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.radius = 10;

  directionalLight.position.set(-15, 15, 15);

  scene.add(directionalLight);

  const clock = new THREE.Clock();

  render();

  function render() {
    wave.update();
    ship.update();

    camera.lookAt(scene.position);
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);
  }

  window.addEventListener("resize", handleResize);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".wrapper",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  });

  tl.to(params, {
    waveColor: "#4268ff",
    onUpdate: () => {
      waveMaterial.color = new THREE.Color(params.waveColor);
    },
    duration: 1.5,
  })
    .to(
      params,
      {
        backgroundColor: "#2a2a2a",
        onUpdate: () => {
          scene.background = new THREE.Color(params.backgroundColor);
        },
        duration: 1.5,
      },
      "<"
    )
    .to(
      params,
      {
        fogColor: "#2f2f2f",
        onUpdate: () => {
          scene.fog.color = new THREE.Color(params.fogColor);
        },
        duration: 1.5,
      },
      "<"
    )
    .to(camera.position, {
      x: 100,
      z: -100,
      duration: 2.5,
    })
    .to(ship.position, {
      z: 150,
      duration: 2,
    })
    .to(
      asianShip.position,
      {
        z: 150,
        duration: 2,
      },
      "<"
    )
    .to(
      vikingShip.position,
      {
        z: 150,
        duration: 2,
      },
      "<"
    )
    .to(camera.position, {
      x: 0,
      y: 25,
      z: 200,
      duration: 2,
    })
    .to(camera.position, {
      x: 0,
      y: 50,
      z: 300,
      duration: 2,
    });

  gsap.to(".title", {
    opacity: 0,
    scrollTrigger: {
      trigger: ".wrapper",
      scrub: true,
      pin: true,
      end: "+=1000",
    },
  });
}
