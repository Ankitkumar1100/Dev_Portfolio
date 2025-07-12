import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useSpring, a, config } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';
// Import user's photo
import mpPhoto from '../assets/mp.jpg';
import cardImage from '../assets/image.png';

const IDCard3D: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lanyardRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [photoImg, setPhotoImg] = useState<HTMLImageElement | null>(null);
  const cardTexture = useLoader(THREE.TextureLoader, cardImage);

  // Load the photo once on mount
  useEffect(() => {
    const img = new window.Image();
    img.src = mpPhoto;
    img.onload = () => setPhotoImg(img);
  }, []);

  // Lanyard anchor point
  const ANCHOR_Y = 3.5;
  // Improved spring config for smooth, premium bounce
  const [anchorSpring, setAnchorSpring] = useSpring(() => ({
    anchor: [0, ANCHOR_Y, 0],
    config: { mass: 1.5, tension: 35, friction: 2 }, // super bouncy
  }));
  const [{ position }, api] = useSpring(() => ({
    position: [0, 0, 0],
    config: { mass: 1.3, tension: 40, friction: 2 }, // super bouncy
  }));
  const bind = useDrag(
    ({ down, movement: [x, y] }) => {
      if (down) {
        api.start({ position: [x / 60, -y / 60, 0] }); // much more stretch
        setAnchorSpring.start({ anchor: [x / 60, ANCHOR_Y + (-y / 60) * 0.7, 0] });
      } else {
        api.start({ position: [0, 0, 0] });
        setAnchorSpring.start({ anchor: [0, ANCHOR_Y, 0] });
      }
    }
  );

  useFrame((state) => {
    if (!hovered && meshRef.current) {
      // Gentle swaying motion like a hanging card
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.02;
    }
  });

  // Helper to draw grayscale image
  function drawGrayscaleImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
    ctx.drawImage(img, x, y, w, h);
    const imageData = ctx.getImageData(x, y, w, h);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
      imageData.data[i] = avg;
      imageData.data[i + 1] = avg;
      imageData.data[i + 2] = avg;
    }
    ctx.putImageData(imageData, x, y);
  }

  // Premium card constants
  const CARD_WIDTH = 3.1;
  const CARD_HEIGHT = 4.4;
  const CARD_DEPTH = 0.12;
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 850;
  const PHOTO_W = 260, PHOTO_H = 320;
  const PHOTO_X = (CANVAS_WIDTH - PHOTO_W) / 2, PHOTO_Y = 180;

  // Card top corners for lanyard attachment
  const CARD_TOP_LEFT = [-CARD_WIDTH / 2 + 0.18, CARD_HEIGHT / 2 - 0.08, 0];
  const CARD_TOP_RIGHT = [CARD_WIDTH / 2 - 0.18, CARD_HEIGHT / 2 - 0.08, 0];

  return (
    <group>
      {/* Lanyard: anchor ring/nail and two strings */}
      <a.group position={anchorSpring.anchor}>
        {/* Nail/ring at the top */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.13, 0.045, 20, 40]} />
          <meshStandardMaterial color="#e0e0e0" metalness={1} roughness={0.15} />
        </mesh>
        {/* Left lanyard string */}
        <a.mesh
          position={[CARD_TOP_LEFT[0], -((ANCHOR_Y - CARD_HEIGHT / 2 + 0.1) / 2), 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.012, 0.012, ANCHOR_Y - CARD_HEIGHT / 2 + 0.1, 16]} />
          <meshStandardMaterial color="#222" />
        </a.mesh>
        {/* Right lanyard string */}
        <a.mesh
          position={[CARD_TOP_RIGHT[0], -((ANCHOR_Y - CARD_HEIGHT / 2 + 0.1) / 2), 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.012, 0.012, ANCHOR_Y - CARD_HEIGHT / 2 + 0.1, 16]} />
          <meshStandardMaterial color="#222" />
        </a.mesh>
      </a.group>
      {/* ID Card */}
      <a.mesh
        ref={meshRef}
        {...bind()}
        position={position as unknown as [number, number, number]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]} />
        <meshStandardMaterial color="#23272f" roughness={0.18} metalness={0.18} />
        {/* Front face with uploaded image as background */}
        <mesh position={[0, 0, CARD_DEPTH / 2 + 0.001]}>
          <planeGeometry args={[CARD_WIDTH - 0.1, CARD_HEIGHT - 0.1]} />
          <meshBasicMaterial map={cardTexture} />
        </mesh>
        
        {/* Back face */}
        <mesh position={[0, 0, -0.041]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.4, 3.4]} />
          <meshBasicMaterial>
            <canvasTexture
              attach="map"
              image={(() => {
                const canvas = document.createElement('canvas');
                canvas.width = 400;
                canvas.height = 566;
                const ctx = canvas.getContext('2d')!;
                
                // Background
                ctx.fillStyle = '#f5f5f5';
                ctx.fillRect(0, 0, 400, 566);
                
                // Header
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(0, 0, 400, 80);
                
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('EMPLOYEE GUIDELINES', 200, 35);
                
                // Guidelines text
                ctx.fillStyle = '#333333';
                ctx.font = '12px Arial';
                ctx.textAlign = 'left';
                const guidelines = [
                  '• This card must be worn at all times',
                  '• Report lost cards immediately',
                  '• Do not share access credentials',
                  '• Follow security protocols',
                  '• Respect company property'
                ];
                
                guidelines.forEach((line, index) => {
                  ctx.fillText(line, 30, 120 + index * 25);
                });
                
                // Contact info
                ctx.fillStyle = '#666666';
                ctx.font = '11px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Security: ext. 911', 200, 300);
                ctx.fillText('HR: ext. 234', 200, 320);
                ctx.fillText('IT Support: ext. 567', 200, 340);
                
                return canvas;
              })()}
            />
          </meshBasicMaterial>
        </mesh>
      </a.mesh>
    </group>
  );
};

const InteractiveCard: React.FC = () => {
  return (
    <div className="w-full max-w-md">
      <div className="h-[26rem] cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <pointLight position={[-5, -5, -5]} intensity={0.3} />
          <IDCard3D />
        </Canvas>
      </div>
      {/* Remove the button from under the card */}
    </div>
  );
};

export default InteractiveCard;