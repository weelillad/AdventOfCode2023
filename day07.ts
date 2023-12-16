import assert from "node:assert";
import { readFileSync } from "node:fs";

type Hand = {
  cards: string;
  bid: number;
  handType: HandType;
}

enum HandType {
  HIGHCARD,
  ONEPAIR,
  TWOPAIR,
  THREEOFAKIND,
  FULLHOUSE,
  FOUROFAKIND,
  FIVEOFAKIND
}

function getType(cards: string): HandType {
  assert(cards.length === 5, `Found hand that doesn't have 5 cards: ${cards}`);
  const countFirstCard = cards.match(new RegExp(`${cards.at(0)}`, 'g'))?.length;
  if (countFirstCard === 5) return HandType['FIVEOFAKIND'];
  else if (countFirstCard === 4) return HandType['FOUROFAKIND'];
  else if (countFirstCard === 3) {
    const otherCards = cards.match(new RegExp(`[^${cards.at(0)}]`, 'g')) ?? [];
    // console.log(otherCards);
    if (otherCards[0] === otherCards[1]) return HandType['FULLHOUSE'];
    else return HandType['THREEOFAKIND'];
  }
  else if (countFirstCard === 2) {
    const otherCards = cards.match(new RegExp(`[^${cards.at(0)}]`, 'g')) ?? [];
    // console.log(otherCards);
    if (otherCards[0] === otherCards[1] && otherCards[0] === otherCards[2]) return HandType['FULLHOUSE'];
    else if (otherCards[0] === otherCards[1] || otherCards[1] === otherCards[2] || otherCards[0] === otherCards[2]) return HandType['TWOPAIR'];
    else return HandType['ONEPAIR'];
  }
  else {
    const countSecondCard = cards.match(new RegExp(`${cards.at(1)}`, 'g'))?.length;
    if (countSecondCard === 4) return HandType['FOUROFAKIND'];
    else if (countSecondCard === 3) return HandType['THREEOFAKIND'];
    else if (countSecondCard === 2) {
      const otherCards = cards.substring(2).match(new RegExp(`[^${cards.at(1)}]`, 'g')) ?? [];
      // console.log(otherCards);
      if (otherCards[0] === otherCards[1]) return HandType['TWOPAIR'];
      else return HandType['ONEPAIR'];
    }
    else {
      const countThirdCard = cards.match(new RegExp(`${cards.at(2)}`, 'g'))?.length;
      if (countThirdCard === 3) return HandType['THREEOFAKIND'];
      else if (countThirdCard === 2) return HandType['ONEPAIR'];
      else if (cards.at(3) === cards.at(4)) return HandType['ONEPAIR'];
      else return HandType['HIGHCARD'];
    }
  }
}

function getCardValue(card: string): number {
  let value = Number(card);
  if (Number.isNaN(value)) {
    switch(card) {
    case 'T':
      value = 10;
      break;
    case 'J':
      value = 11;
      break;
    case 'Q':
      value = 12;
      break;
    case 'K':
      value = 13;
      break;
    case 'A':
      value = 14;
      break;
    default:
      console.log('Unkown card value: %s', card);
      value = 0;
    }
  }
  return value;
}

function cardCompare(lhs: Hand, rhs: Hand): number {
  let difference = getCardValue(lhs.cards[0]) - getCardValue(rhs.cards[0]);
  for (let i = 1; i < 5 && difference === 0; i++) {
    difference = getCardValue(lhs.cards[i]) - getCardValue(rhs.cards[i]);
  }
  return difference;
}

function runDay7Logic(input: string): [number, number] {
  const hands = input.split("\n").map(line => {
    const [cards, bidStr] = line.split(' ');
    return {
      cards,
      bid: Number(bidStr),
      handType: getType(cards)
    };
  });
  const result: [number, number] = [0, 0];

  // Part 1 answer
  hands.sort((a, b) => {
    // console.log('A: %s %s, B: %s %s', a.cards, a.handType, b.cards, b.handType)
    const typeCompare = a.handType - b.handType;
    return typeCompare !== 0
      ? typeCompare
      : cardCompare(a, b);
  });
  // console.log(hands);
  hands.forEach((hand, index) => {
    result[0] += hand.bid * (index + 1);
  });

  return result;
}

const day7TestData =
  `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

function day7Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [6440, 0];

  const answer = runDay7Logic(day7TestData);
  
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

function day7() {
  const input = readFileSync("./input07.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay7Logic(input.trimEnd()));
}

day7Test() && day7();
