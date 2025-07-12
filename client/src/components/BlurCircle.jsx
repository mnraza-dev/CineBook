import React from "react";

const defaultColors = ["#b99a45", "#f5ec9b", "#e3d6b4", "#C7AE6A"];

const BlurCircle = ({
  top,
  right,
  bottom,
  left,
  size = "200px", // Reduced from 300px to 200px
  opacity = "0.5",
  colorIndex = 3,
}) => {
  const color = defaultColors[colorIndex % defaultColors.length];

  const style = {
    position: "absolute",
    top,
    right,
    bottom,
    left,
    width: size,
    height: size,
    backgroundColor: color,
    opacity,
    borderRadius: "50%",
    filter: "blur(80px)", // Reduced blur for better match with smaller size
    zIndex: -1,
  };

  return <div style={style}></div>;
};

export default BlurCircle;
