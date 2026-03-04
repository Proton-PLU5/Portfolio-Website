<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  // resolved at build time by Vite — points to `src/lib/assets/website_about_me_minecraft_scene.glb`
  import modelAssetUrl from '$lib/assets/website_about_me_minecraft_scene.glb?url';
  let container: HTMLDivElement | null = null;

  let raf = 0;
  let renderer: any;
  let controls: any;
  let scene: any;
  let camera: any;
  let model: any = null;
  let mixer: any = null;
  let clock: any = null;
  let gltfLoader: any = null;
  let dracoLoader: any = null;
  let observer: IntersectionObserver | null = null;
  let running = false;

  // filename used for your GLB; place it in `static/models/` for best compatibility
  const MODEL_FILE = 'website_about_me_minecraft_scene.glb';
  const MODEL_CANDIDATES = [
    modelAssetUrl, // Vite-resolved URL for `src/lib/assets/...` (preferred)
    `/models/${MODEL_FILE}`,
    `/${MODEL_FILE}`,
    `models/${MODEL_FILE}`,
    `./models/${MODEL_FILE}`
  ];

  onMount(() => {
    // keep cleanup reference outside the async worker so we return synchronously
    let cleanup = () => {};

    (async () => {
      // load three & examples on client only
      const THREE = await import('three');
      clock = new THREE.Clock();
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      camera.position.set(0, 1.2, 3);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(container!.clientWidth, container!.clientHeight);
      // avoid setting outputEncoding here (version/type mismatch across three versions)
      container!.appendChild(renderer.domElement);

      // model will be loaded into the scene (no fallback sphere)

      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      const dlight = new THREE.DirectionalLight(0xffffff, 1);
      dlight.position.set(5, 5, 5);
      scene.add(dlight);

      // controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.autoRotate = false; // ensure no automatic spinning

      const adjustCanvasToSection = () => {
        if (!container) return;
        const about = container.closest('.about-me') as HTMLElement | null;
        if (!about || window.innerWidth < 1024) {
          container.style.height = '';
          container.style.marginTop = '';
          container.style.marginBottom = '';
          return;
        }
        const parentH = about.clientHeight;
        const canvasH = Math.max(320, Math.round(parentH * 0.8));
        const pad = Math.round((parentH - canvasH) / 2);
        container.style.height = `${canvasH}px`;
        container.style.marginTop = `${pad}px`;
        container.style.marginBottom = `${pad}px`;
      };

      const resize = () => {
        adjustCanvasToSection();
        const w = container!.clientWidth;
        const h = container!.clientHeight || 320;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      };
      window.addEventListener('resize', resize);

      // compute box/sphere, recenter the object, scale and position the camera to frame it
      const frameModel = (obj: any) => {
        if (!obj || !container) return;

        // Force update of all matrices
        obj.updateMatrixWorld(true);

        // Compute the bounding box of the object
        const box = new THREE.Box3().setFromObject(obj);
        
        // If box is empty (e.g. no mesh), abort
        if (box.isEmpty()) {
            console.warn('ThreeScene: Box is empty, cannot frame model.');
            return;
        }

        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Debug output to help diagnose strict offset issues
        console.log('ThreeScene: Bounding Box', { min: box.min, max: box.max, center, size });

        // STRATEGY: Instead of moving the model to (0,0,0), we move the camera and controls to the model.
        // This avoids issues where modifying the model's position breaks internal animations or transforms.
        
        // 1. Point controls slightly below center so the model sits higher visually
        if (controls) {
            controls.target.copy(center);
            controls.target.y -= size.y * 0.2; // shift target down -> model moves up
            controls.update();
        }

        // 2. Position camera relative to that center
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        
        cameraZ *= 1.5; // Closer zoom (was 2.0) 

        // Apply new camera position
        camera.position.set(
            center.x, 
            center.y + size.y * 0.2, // slightly lower camera angle
            center.z + cameraZ
        );

        // Ensure camera looks at the shifted target
        camera.lookAt(controls.target);

        // Update projection in case aspect changed
        camera.updateProjectionMatrix();
        
        if (controls) {
            controls.saveState(); // Saved so reset works if we implemented it
        }
      };

      // animation loop control
      const tick = () => {
        if (!running) return;
        
        // update animations
        if (mixer && clock) {
            mixer.update(clock.getDelta());
        }

        controls.update();
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      const start = () => {
        if (running) return;
        running = true;
        raf = requestAnimationFrame(tick);
      };
      const stop = () => {
        if (!running) return;
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      };

      // intersection observer: pause when offscreen
      observer = new IntersectionObserver((entries) => {
        const e = entries[0];
        if (!e) return;
        if (e.isIntersecting) start();
        else stop();
      }, { threshold: 0.05 });
      observer.observe(container!);

      // initial sizing + start
      resize();
      start();

      // helper: attempt to load the GLB from a set of likely paths
      const tryLoadGLB = async () => {
        try {
          const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
          gltfLoader = new GLTFLoader();

          // optional DRACO support (decoder path `/draco-gltf/` — you can host Draco decoder in static if needed)
          try {
            const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js');
            dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('/draco-gltf/');
            gltfLoader.setDRACOLoader(dracoLoader);
          } catch (err) {
            // Draco not available — that's fine
            dracoLoader = null;
          }

          for (const p of MODEL_CANDIDATES) {
            try {
              const gltf: any = await new Promise((resolve, reject) =>
                gltfLoader.load(p, resolve, undefined, reject)
              );
              model = gltf.scene || gltf.scenes?.[0];
              if (!model) throw new Error('GLTF had no scene');

              // Apply requested rotation (135 degrees on Z axis)
              model.rotation.y = (180+45) * (Math.PI / 180);
              model.rotation.x = 20 * (Math.PI / 180); // slight tilt for better 3D effect
              model.updateMatrixWorld(); // update before framing

              // add to scene
              scene.add(model);
              
              // check for animations
              if (gltf.animations && gltf.animations.length) {
                  mixer = new THREE.AnimationMixer(model);
                  const action = mixer.clipAction(gltf.animations[0]);
                  action.play();
                  console.info('ThreeScene: playing animation', gltf.animations[0].name);
              }

              // frame the model immediately
              frameModel(model);
              
              // console logging for verification
              console.info('ThreeScene: loaded GLB', p);
              break; // stop after first successful load
            } catch (err) {
              // try next path
              // console.debug('ThreeScene: failed to load', p, err);
            }
          }
        } catch (err) {
          console.warn('ThreeScene: GLTFLoader not available / load failed', err);
        }
      };

      tryLoadGLB();

      // set cleanup function (outer onMount returns this synchronously)
      cleanup = () => {
        stop();
        window.removeEventListener('resize', resize);
        observer && observer.disconnect();
        controls && controls.dispose();



        // dispose the loaded model if present
        if (model) {
          model.traverse((o: any) => {
            if (o.isMesh) {
              o.geometry && o.geometry.dispose();
              if (o.material) {
                if (Array.isArray(o.material)) o.material.forEach((m: any) => m.dispose());
                else o.material.dispose();
              }
            }
          });
        }

        // dispose animations
        if (mixer) {
            mixer.stopAllAction();
            mixer = null;
        }

        // dispose loaders
        dracoLoader && dracoLoader.dispose && dracoLoader.dispose();
        gltfLoader = null;

        renderer && renderer.dispose();
        renderer && renderer.domElement && renderer.domElement.remove();
        scene && scene.clear();
      };
    })();

    return () => cleanup();
  });

  onDestroy(() => {
    if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(raf);
  });
</script>

<div bind:this={container} class="three-canvas"></div>

<style>
  .three-canvas { width: 100%; height: 320px; border-radius: 0.6rem; overflow: hidden; }
  @media (min-width: 1024px) { .three-canvas { height: 420px; } }
</style>