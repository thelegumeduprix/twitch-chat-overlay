import unicodeSlice from "./unicodeSlice.js";

export default function splitByRanges(message, emotes) {
  let replacementList = [];
  for (const [emoteId, occurenceIndices] of Object.entries(emotes)) {
    occurenceIndices.forEach((indexPair) => {
      const [startIndex, endIndex] = indexPair.split("-");
      replacementList.push({
        emoteStartIndex: Number(startIndex),
        emoteEndIndex: Number(endIndex) + 1,
        emoteId,
      });
    });
  }

  // sort by start index
  replacementList = replacementList.sort(
    (a, b) => a.emoteStartIndex - b.emoteStartIndex
  );

  const result = [];
  let currentIndex = 0;
  replacementList.forEach(({ emoteStartIndex, emoteEndIndex, emoteId }) => {
    const previousTextPart = {
      type: "text",
      content: unicodeSlice(message, currentIndex, emoteStartIndex),
    };

    const emotePart = {
      type: "emote",
      content: emoteId,
    };

    result.push(previousTextPart, emotePart);
    currentIndex = emoteEndIndex;
  });

  const trailingText = unicodeSlice(message, currentIndex);

  if (trailingText) {
    result.push({ type: "text", content: trailingText });
  }

  return result;
}
