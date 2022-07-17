import React from "react";

interface Props {
  width?: string;
  height?: string;
  className?: string;
}

const ProfileIcon: React.FC<Props> = ({
  width = "100%",
  height = "auto",
  className = ""
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 48 48"
    width={width}
    height={height}
    style={{
      cursor: "pointer"
    }}
    className={className}
  >
    <g id="User_profile" data-name="User profile">
      <path d="M47 24A23 23 0 1 1 12.81 3.91 23 23 0 0 1 47 24z" style={{ fill: "#374f68" }}/>
      <path d="M47 24a22.91 22.91 0 0 1-8.81 18.09A22.88 22.88 0 0 1 27 45C5.28 45-4.37 17.34 12.81 3.91A23 23 0 0 1 47 24z" style={{ fill: "#425b72" }}/>
      <path className="cls-3" style={{ fill: "#6fabe6" }} d="M39.2 35.39a19 19 0 0 1-30.4 0 17 17 0 0 1 10.49-8.73 8.93 8.93 0 0 0 9.42 0 17 17 0 0 1 10.49 8.73z"/>
      <path className="cls-4" style={{ fill: "#82bcf4" }} d="M39.2 35.39a19 19 0 0 1-4.77 4.49 19 19 0 0 1-15.13-1 7.08 7.08 0 0 1-.51-12.18c.1-.07 0-.05.5-.05a9 9 0 0 0 9.42 0 17 17 0 0 1 10.49 8.74z"/>
      <path className="cls-3" style={{ fill: "#6fabe6" }} d="M33 19a9 9 0 1 1-12.38-8.34A9 9 0 0 1 33 19z"/>
      <path className="cls-4" style={{ fill: "#82bcf4" }} d="M33 19a9 9 0 0 1-2.6 6.33c-9.13 3.74-16.59-7.86-9.78-14.67A9 9 0 0 1 33 19z"/>
    </g>
  </svg>
);

export default ProfileIcon;