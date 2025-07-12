import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, a } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';

const IDCard3D: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lanyardRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const [{ rotation, position }, api] = useSpring(() => ({
    rotation: [0, 0, 0],
    position: [0, 0, 0],
    config: { mass: 1, tension: 180, friction: 12 }
  }));

  const bind = useDrag(
    ({ down, movement: [x, y] }) => {
      if (down) {
        api.start({
          rotation: [y / 200, x / 200, x / 400],
          position: [x / 300, -y / 300, 0]
        });
      } else {
        api.start({
          rotation: [0, 0, 0],
          position: [0, 0, 0]
        });
      }
    },
    { pointerEvents: true }
  );

  useFrame((state) => {
    if (!hovered && meshRef.current) {
      // Gentle swaying motion like a hanging card
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.02;
    }
  });

  return (
    <group>
      {/* Lanyard */}
      <mesh ref={lanyardRef} position={[0, 3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* ID Card */}
      <a.mesh
        ref={meshRef}
        {...bind()}
        rotation={rotation as any}
        position={position as any}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[2.5, 3.5, 0.08]} />
        <meshStandardMaterial
          color="#f8f8f8"
          roughness={0.1}
          metalness={0.1}
        />
        
        {/* Front face with ID content */}
        <mesh position={[0, 0, 0.041]}>
          <planeGeometry args={[2.4, 3.4]} />
          <meshBasicMaterial>
            <canvasTexture
              attach="map"
              image={(() => {
                const canvas = document.createElement('canvas');
                canvas.width = 400;
                canvas.height = 566;
                const ctx = canvas.getContext('2d')!;
                
                // White background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, 400, 566);
                
                // Header section
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(0, 0, 400, 80);
                
                // Company logo area
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('TECH CORP', 200, 35);
                ctx.font = '12px Arial';
                ctx.fillText('Software Development', 200, 55);
                
                // Photo placeholder (black and white effect)
                ctx.fillStyle = '#e0e0e0';
                ctx.fillRect(150, 100, 100, 120);
                ctx.strokeStyle = '#cccccc';
                ctx.lineWidth = 2;
                ctx.strokeRect(150, 100, 100, 120);
                
                // Simple avatar
                ctx.fillStyle = '#666666';
                ctx.beginPath();
                ctx.arc(200, 140, 30, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#333333';
                ctx.font = 'bold 24px Arial';
                ctx.fillText('AK', 200, 150);
                
                // Name
                ctx.fillStyle = '#000000';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('ANKIT KUMAR', 200, 260);
                
                // Designation
                ctx.font = '16px Arial';
                ctx.fillStyle = '#333333';
                ctx.fillText('Full Stack Developer', 200, 285);
                
                // ID Number
                ctx.font = '14px Arial';
                ctx.fillStyle = '#666666';
                ctx.fillText('ID: EMP001234', 200, 320);
                
                // Department
                ctx.fillText('Engineering Department', 200, 340);
                
                // Barcode simulation
                ctx.fillStyle = '#000000';
                for (let i = 0; i < 20; i++) {
                  const x = 50 + i * 15;
                  const height = Math.random() * 20 + 10;
                  ctx.fillRect(x, 380, 2, height);
                }
                
                // Footer
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(0, 450, 400, 116);
                
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Valid Until: 12/2025', 200, 480);
                ctx.fillText('Emergency Contact: +1-555-0123', 200, 500);
                
                return canvas;
              })()}
            />
          </meshBasicMaterial>
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
    <div className="w-full max-w-sm">
      <div className="h-96 cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <pointLight position={[-5, -5, -5]} intensity={0.3} />
          <IDCard3D />
        </Canvas>
      </div>
      <div className="text-center mt-4">
        <div className="text-green-400 text-sm border border-green-400 rounded px-4 py-2 inline-block">
          [Interactive 3D Card]
        </div>
      </div>
    </div>
  );
};

export default InteractiveCard;