import React, { useContext, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Circle, Line, Text as SvgText } from 'react-native-svg';
import { AnchorsContext } from '@/components/AnchorsContext';
import ReturnToHomeButton from '@/components/ReturnToHomeButton';

const GRID_SIZE = 10; // Define the size of the grid squares
const GRID_LINES = 11; // Number of lines in the grid
const MAP_WIDTH = 300; // Width of the map
const MAP_HEIGHT = 300; // Height of the map

export default function MapScreen() {
  const { anchors } = useContext(AnchorsContext);

  // Function to scale coordinates to fit within the map dimensions
  const scaleCoordinates = (value: number, maxValue: number) => {
    const scaleFactor = MAP_WIDTH / maxValue;
    return value * scaleFactor;
  };

  // Multilaterate the phone's position
  const multilaterate = () => {
    const anchorList = Object.values(anchors).filter(
      (anchor) => anchor.coordinates && anchor.distance !== undefined // Check for distance
    );
  
    if (anchorList.length < 3) {
      return null; // Not enough anchors for multilateration
    }
  
    const [A, B, C] = anchorList; // Using the first three anchors for multilateration
    const { x: x1, y: y1 } = A.coordinates!;
    const { x: x2, y: y2 } = B.coordinates!;
    const { x: x3, y: y3 } = C.coordinates!;
    const r1 = A.distance!;
    const r2 = B.distance!;
    const r3 = C.distance!;
  
    // Multilateration formulas
    const A1 = 2 * (x2 - x1);
    const B1 = 2 * (y2 - y1);
    const C1 = x1 * x1 - x2 * x2 + y1 * y1 - y2 * y2 + r2 * r2 - r1 * r1;
  
    const A2 = 2 * (x3 - x1);
    const B2 = 2 * (y3 - y1);
    const C2 = x1 * x1 - x3 * x3 + y1 * y1 - y3 * y3 + r3 * r3 - r1 * r1;
  
    const det = A1 * B2 - A2 * B1;
    if (Math.abs(det) < 1e-6) {
      return null; // Circles do not intersect or are degenerate
    }
  
    const px = (C1 * B2 - C2 * B1) / det;
    const py = (A1 * C2 - A2 * C1) / det;
  
    return { x: px, y: py };
  };

  // Memoized phone position
  const phonePosition = useMemo(() => multilaterate(), [anchors]);

  return (
    <View style={styles.container}>
      <Svg width={MAP_WIDTH} height={MAP_HEIGHT} style={styles.map}>
        {/* Draw grid lines */}
        {Array.from({ length: GRID_LINES }).map((_, index) => {
          const spacing = (index / (GRID_LINES - 1)) * MAP_WIDTH;
          return (
            <React.Fragment key={index}>
              {/* Horizontal lines */}
              <Line
                x1="0"
                y1={spacing}
                x2={MAP_WIDTH}
                y2={spacing}
                stroke="#ccc"
                strokeWidth="1"
              />
              {/* Vertical lines */}
              <Line
                x1={spacing}
                y1="0"
                x2={spacing}
                y2={MAP_HEIGHT}
                stroke="#ccc"
                strokeWidth="1"
              />
            </React.Fragment>
          );
        })}

        {/* Draw anchors as blue circles */}
        {Object.values(anchors).map((anchor) => {
          if (anchor.coordinates) {
            const x = scaleCoordinates(anchor.coordinates.x, GRID_LINES - 1);
            const y = scaleCoordinates(anchor.coordinates.y, GRID_LINES - 1);

            return (
              <React.Fragment key={anchor.id}>
                <Circle
                  cx={x}
                  cy={MAP_HEIGHT - y} // Flip Y-axis to match typical grid orientation
                  r="5"
                  fill="blue"
                />
                <SvgText
                  x={x + 8}
                  y={MAP_HEIGHT - y - 8}
                  fontSize="12"
                  fill="black"
                >
                  {anchor.name}
                </SvgText>
              </React.Fragment>
            );
          }
          return null;
        })}

        {/* Draw phone position as red circle */}
        {phonePosition && (
          <Circle
            cx={scaleCoordinates(phonePosition.x, GRID_LINES - 1)}
            cy={MAP_HEIGHT - scaleCoordinates(phonePosition.y, GRID_LINES - 1)}
            r="5"
            fill="red"
          />
        )}
      </Svg>
      <ReturnToHomeButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  map: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
});