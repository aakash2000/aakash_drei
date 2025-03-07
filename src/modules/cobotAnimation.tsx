import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CobotAnimation = () => {
  const mountRef = useRef<HTMLDivElement>(null); // Create a ref for the mount point

  useEffect(() => {
    const ref = mountRef.current;
    if (!ref) return;
    // Scene
    const scene = new THREE.Scene();

    // Animation Variables
    let autoAngle = -Math.PI / 6; // Start at -30 degrees
    let autoDirection = 1;        // 1 for increasing, -1 for decreasing

    // Adjustable angle limits (in radians)
    const angleMin = -Math.PI / 9; // -30 degrees
    const angleMax = Math.PI / 9;  // 30 degrees

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      600 / 400,
      0.1,
      1000
    );
    camera.position.z = 14;
    camera.position.y = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(600, 400);
    renderer.setPixelRatio(window.devicePixelRatio);
    // Append renderer to the animation container
    ref.appendChild(renderer.domElement);

    // Handle resizing
    window.addEventListener('resize', () => {
      const width = ref.clientWidth;
      const height = ref.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });

    // Initial resize to fit the container
    const initialWidth = ref.clientWidth;
    const initialHeight = ref.clientHeight;
    renderer.setSize(initialWidth, initialHeight);
    camera.aspect = initialWidth / initialHeight;
    camera.updateProjectionMatrix();

    // Light
    // Enhanced Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(10, 10, 10);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-10, 10, -10);
    scene.add(directionalLight2);

    const joint1Material = new THREE.MeshStandardMaterial({ color: "#a5a8a8" });

    // Cobot Base (Cylinder)
    // Create a base joint using LatheGeometry
    const lathePoints = [];
    for (let i = 0; i < 10; i++) {
      lathePoints.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.8 + 0.8, i * 0.3));
    }
    const baseGeometry = new THREE.LatheGeometry(lathePoints, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: "#a5a8a8" });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.rotation.z = Math.PI;
    base.scale.set(1, 0.4, 1); // Maintain X and Z scale, compress Y
    scene.add(base);

    // Joint 1 (Sphere)
    const joint1 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32, 0, Math.PI), joint1Material);
    joint1.scale.set(1, 0.5, 1); // Compress Y
    base.add(joint1);

    // Arm 1 (Cylinder)
    const arm1Geometry = new THREE.CylinderGeometry(0.8, 0.8, 4, 32);
    const arm1Material = new THREE.MeshStandardMaterial({ color: "#f59e42" });
    const arm1 = new THREE.Mesh(arm1Geometry, arm1Material);
    scene.add(arm1);

    // Joint 2 (Sphere)
    const joint2 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32, 0, Math.PI), joint1Material);
    joint2.scale.set(1, 0.5, 1); // Compress Y
    arm1.add(joint2);

    // Arm 2 (Cylinder)
    const arm2Geometry = new THREE.CylinderGeometry(0.8, 0.8, 2.5, 32);
    const arm2 = new THREE.Mesh(arm2Geometry, arm1Material);
    scene.add(arm2);

    // Joint 3 (Sphere)
    const joint3 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32, 0, Math.PI), joint1Material);
    joint3.scale.set(1, 0.5, 1); // Compress Y
    arm2.add(joint3);

    // Arm 3 (Cylinder) and further joints
    const arm3Geometry = new THREE.CylinderGeometry(0.8, 0.8, 2.5, 32);
    const arm3 = new THREE.Mesh(arm3Geometry, arm1Material);
    scene.add(arm3);

    const topYellowBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 32, 32, 0, Math.PI / 1.2),
      new THREE.MeshStandardMaterial({ color: "#a5a8a8" })
    );
    topYellowBall.rotation.z = Math.PI / 2;
    topYellowBall.position.y = 1;
    arm3.add(topYellowBall);

    // Positioning Arms and Joints
    arm1.position.y = 1.8;
    arm2.position.y = 5.2;
    arm3.position.y = 8.2;
    joint1.position.y = -0.2;
    joint2.position.y = 2.2;
    joint3.position.y = 1.5;


    // Animation Loop
    function animate() {

      // Update autoAngle
      autoAngle += 0.013 * autoDirection; // Adjust the speed by changing 0.015

      // Reverse direction if limits are reached using angleMin and angleMax
      if (autoAngle > angleMax) { // Upper limit
        autoAngle = angleMax;
        autoDirection = -1;
      } else if (autoAngle < angleMin) { // Lower limit
        autoAngle = angleMin;
        autoDirection = 1;
      }

      // Apply the 'Arm 3' Slider Logic with autoAngle
      arm3.rotation.z = autoAngle * Math.cos(autoAngle);
      arm3.rotation.x = autoAngle * Math.sin(autoAngle);
      arm3.position.y = 8 * Math.cos(autoAngle);

      arm2.rotation.z = -autoAngle * Math.cos(autoAngle);
      arm2.rotation.x = -autoAngle * Math.sin(autoAngle);
      arm2.position.y = 5.2 * Math.cos(autoAngle);

      arm1.rotation.z = (autoAngle / 2) * Math.cos(autoAngle);
      arm1.rotation.x = (autoAngle / 2) * Math.sin(autoAngle);
      arm1.position.y = 1.8 * Math.cos(autoAngle);

      base.position.x = 0.5 * Math.sin(autoAngle);

      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    return () => {
      if (!ref) return;
      ref.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} />;
};

export default CobotAnimation;
