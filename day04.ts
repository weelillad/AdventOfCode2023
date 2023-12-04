import { readFileSync } from "node:fs";

type Card = {
  id: number
  winningNums: Set<number>,
  scratchNums: Set<number>,
  wonScratchCards?: Array<number>
};

function parseCard(cardData: string): Card {
  const [cardNum, numsString] = cardData.substring(5).split(': ');
  const [winningNumsString, scratchNumsString] = numsString.split(' | ');
  const winningNums = winningNumsString.trim().split(/\s+/g).map(numStr => Number(numStr));
  const scratchNums = scratchNumsString.trim().split(/\s+/g).map(numStr => Number(numStr));
  return {
    id: Number(cardNum),
    winningNums: new Set(winningNums),
    scratchNums: new Set(scratchNums)
  };
}

function countWins(card: Card): number {
  let winCount = 0;
  card.winningNums.forEach(num => {
    if (card.scratchNums.has(num)) winCount++;
  })
  return winCount;
}

function runDay4Logic(input: string): [number, number] {
  const cardsStr = input.split("\n");
  const result: [number, number] = [0, 0];

  const cards: Array<Card> = [];

  for (const cardStr of cardsStr) {
    const card: Card = parseCard(cardStr);
    const numWins = countWins(card);

    const wonScratchCards = [];
    for(let i = 1; i <= numWins; i++) {
      wonScratchCards.push(card.id + i);
    }
    card.wonScratchCards = wonScratchCards;
    // console.log(card);

    cards.push(card);

    // Part 1 answer
    const score = numWins > 0 ? Math.pow(2, numWins - 1) : 0;
    // console.log(`Card ${card.id}: ${score} points`);
    result[0] += score;
  }

  // Part 2 answer
  // Skip index 0 so that card ID and array index are the same
  const scratchcardIdCount = new Array(cards.length + 1);
  scratchcardIdCount[0] = 0;
  scratchcardIdCount.fill(1, 1);
  scratchcardIdCount.forEach((count, id) => {
    if (count === 0) return;
    result[1] += count;
    cards[id - 1].wonScratchCards?.forEach(wonCardId => {
      scratchcardIdCount[wonCardId] += count;
    });
  });

  return result;
}

const day4TestData =
  `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

function day4Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [13, 30];

  const answer = runDay4Logic(day4TestData);

  const part1TestPass = answer[0] === answerKey[0];
  const part2TestPass = answer[1] === answerKey[1];

  part1TestPass
    ? console.log("Part 1 Test passed!!")
    : console.log(`PART 1 TEST FAILED!! Expected answer: ${answerKey[0]}. Received answer: ${answer[0]}`);

  part2TestPass
    ? console.log("Part 2 Test passed!!")
    : console.log(`PART 2 TEST FAILED!! Expected answer: ${answerKey[1]}. Received answer: ${answer[1]}`);

  return part1TestPass && part2TestPass;
}

function day4() {
  const input = readFileSync("./input04.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay4Logic(input.trimEnd()));
}

day4Test() && day4();
