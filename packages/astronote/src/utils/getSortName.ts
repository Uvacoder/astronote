export default function getSortName(name: string) {
  return name
    .split(" ")
    .map((item) => item[0])
    .join("")
    .slice(0, 2);
}
