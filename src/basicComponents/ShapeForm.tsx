/**
 * @fileoverview This file creates a simple SVG image that looks like a geometry figure of some shape based on the 
 * available shapes for the user's nodes in vis.js networks. If the shape introduced is unavailable, a circle will be
 * drawn.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */

interface ShapeFormProps {
    shape: string;
    scale?: number;
    color?: string;
}

//Diferent paths for the diferent available shapes
const shapeToPath = new Map<string, string>();
shapeToPath.set("diamond", "50 0, 0 50, 50 100, 100 50");
shapeToPath.set("star", "50 5, 61 40, 98 40, 68 62, 79 96, 50 75, 21 96, 32 62, 2 40, 39 40");
shapeToPath.set("triangle", "50 0, 100 100, 0 100");
shapeToPath.set("square", "100 0, 100 100, 0 100, 0 0");
shapeToPath.set("triangleDown", "0 0, 50 100, 100 0");
shapeToPath.set("hexagon", "25 5, 75 5, 100 50, 75 95, 25 95, 0 50");


/**
 * UI component that draws a SVG shape.
 */
export const ShapeForm = ({
    shape,
    scale = 1,
    color = "black",
}: ShapeFormProps) => {

    let figure = <circle cx="50" cy="50" r="50" />;

    if (shape !== "dot") {
        figure = <polygon points={shapeToPath.get(shape)} />
    }

    return (

        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
            style={{ verticalAlign: "middle" }}
            height={`${1.2 * scale}rem`}
            viewBox="0 0 100.000000 100.000000"
            preserveAspectRatio="xMidYMid meet">

            <g
                fill={color} stroke="none">
                {figure}
            </g>
        </svg>
    );
};
