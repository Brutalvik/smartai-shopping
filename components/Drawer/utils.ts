// components/drawer/utils.ts

export const avatarColors = [
  { bg: "#FF6B6B", fg: "#FFFFFF" },
  { bg: "#6BCB77", fg: "#FFFFFF" },
  { bg: "#4D96FF", fg: "#FFFFFF" },
  { bg: "#FFD93D", fg: "#000000" },
  { bg: "#FF9F1C", fg: "#000000" },
  { bg: "#845EC2", fg: "#FFFFFF" },
  { bg: "#2C3E50", fg: "#FFFFFF" },
  { bg: "#00C9A7", fg: "#000000" },
  { bg: "#E63946", fg: "#FFFFFF" },
  { bg: "#1D3557", fg: "#FFFFFF" },
];

export function getColorByName(
  name: string,
  avatarColors: { bg: string; fg: string }[]
) {
  const code = [...name.toLowerCase()].reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  return avatarColors[code % avatarColors.length];
}
