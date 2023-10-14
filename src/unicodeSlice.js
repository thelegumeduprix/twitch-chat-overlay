// JavaScript's standard slice function does not work well with strings that contain
// unicode characters represented by more than one code unit. This trick helps solve
// that problem:
export default function unicodeSlice(string, start, end) {
  return [...string].slice(start, end).join("");
}
