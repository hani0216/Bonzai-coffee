import { T } from "../theme/colors";

export default function GoldLine({ style = {} }) {
  return (
    <div
      style={{
        width: "100%",
        height: 1,
        background: `linear-gradient(to right, transparent, ${T.gold}, transparent)`,
        margin: "10px 0",
        ...style,
      }}
    />
  );
}