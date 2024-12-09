import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, -10px) rotate(90deg); }
  50% { transform: translate(-5px, 15px) rotate(180deg); }
  75% { transform: translate(-10px, -5px) rotate(270deg); }
`;

interface SprinkleProps {
  $x: number;
  $y: number;
  $rotation: number;
  $delay: number;
  $color: string;
}

const SprinkleElement = styled.div<SprinkleProps>`
  position: absolute;
  left: ${props => props.$x}%;
  top: ${props => props.$y}%;
  width: 6px;
  height: 2px;
  background-color: ${props => props.$color};
  transform: rotate(${props => props.$rotation}deg);
  animation: ${float} 10s infinite ${props => props.$delay}s linear;
  border-radius: 1px;
  pointer-events: none;
  will-change: transform;
`;

export const Sprinkle = (props: SprinkleProps) => {
  return <SprinkleElement {...props} className="sprinkle" />;
}; 