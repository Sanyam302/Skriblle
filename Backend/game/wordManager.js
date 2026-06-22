import wordsData from "../data/word.json" with {
  type: "json"
};

export function getRandomWords(
  count = 3
) {

  const allWords =
    Object.values(wordsData).flat();

  const selectedWords = [];

  while (
    selectedWords.length < count
  ) {

    const randomIndex =
      Math.floor(
        Math.random() *
        allWords.length
      );

    const word =
      allWords[randomIndex];

    if (
      !selectedWords.includes(word)
    ) {
      selectedWords.push(word);
    }
  }

  return selectedWords;
}

export function revealLetter(
  word,
  currentHint
) {
  const hintArray =
    currentHint.split(" ");

  const hiddenIndexes = [];

  hintArray.forEach(
    (char, index) => {
      if (char === "_") {
        hiddenIndexes.push(index);
      }
    }
  );

  if (
    hiddenIndexes.length === 0
  ) {
    return currentHint;
  }

  const randomIndex =
    hiddenIndexes[
      Math.floor(
        Math.random() *
          hiddenIndexes.length
      )
    ];

  hintArray[randomIndex] =
    word[randomIndex];

  return hintArray.join(" ");
}