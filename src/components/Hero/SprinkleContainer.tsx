'use client'

import { useMemo } from 'react';
import { useTheme } from 'styled-components';
import { Sprinkle } from './Sprinkle';

// Create a deterministic array of positions
const SPRINKLE_POSITIONS = Array.from({ length: 100 }, (_, i) => ({
  x: ((i * 14) % 100), // Use modulo to keep within 0-100
  y: ((i * 17) % 100),
  rotation: ((i * 25) % 360),
  delay: -((i * 7) % 20),
}));

export const SprinkleContainer = () => {
  const theme = useTheme();

  const sprinkles = useMemo(() => {
    return SPRINKLE_POSITIONS.map((pos, i) => ({
      $x: pos.x,
      $y: pos.y,
      $rotation: pos.rotation,
      $delay: pos.delay,
      $color: i % 2 ? theme.colors.primary[300] : theme.colors.secondary[300],
      key: i,
    }));
  }, [theme]);

  return (
    <>
      {sprinkles.map(props => (
        <Sprinkle {...props} key={props.key} />
      ))}
    </>
  );
}; 