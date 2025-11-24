import {
  green,
  red,
  amber,
  blue,
  blueGrey,
  cyan,
  deepOrange,
  deepPurple,
  lightBlue,
  lightGreen,
  indigo,
  lime,
  orange,
  pink,
  purple,
  teal,
  yellow,
} from "@mui/material/colors";

type ColorShades = { [shade: string]: string };

const colorPalette: ColorShades[] = [
  yellow,
  green,
  red,
  amber,
  blue,
  blueGrey,
  cyan,
  deepOrange,
  deepPurple,
  lightBlue,
  lightGreen,
  indigo,
  lime,
  orange,
  pink,
  purple,
  teal,
];

const randomColor = (): string => {
  const colObj = colorPalette[Math.floor(Math.random() * colorPalette.length)];
  const preferredShades = [500, 600, 400, 700, 300, 200, 50];
  for (const s of preferredShades) {
    const key = String(s);
    if (colObj[key]) return colObj[key];
  }
  const vals = Object.values(colObj);
  return typeof vals[0] === "string" ? vals[0] : "#FFC107";
};

export default randomColor;
