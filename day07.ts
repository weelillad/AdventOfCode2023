import assert from "node:assert";
import { readFileSync } from "node:fs";

type Hand = {
  cards: string;
  bid: number;
  handType: HandType;
}

export enum HandType {
  HIGHCARD,
  ONEPAIR,
  TWOPAIR,
  THREEOFAKIND,
  FULLHOUSE,
  FOUROFAKIND,
  FIVEOFAKIND
}

function getType(cards: string): HandType {
  assert(cards.length === 5, `Found hand that doesn't have 5 cards`);
  const countFirstCard = cards.match(new RegExp(`${cards.at(0)}`, 'g'))?.length;
  if (countFirstCard === 5) return HandType.FIVEOFAKIND;
  else if (countFirstCard === 4) return HandType.FOUROFAKIND;
  else if (countFirstCard === 3) {
    const otherCards = cards.match(new RegExp(`[^${cards.at(0)}]`, 'g')) ?? [];
    // console.log(otherCards);
    assert(otherCards.length === 2, `Found odd hand`);
    if (otherCards[0] === otherCards[1]) return HandType.FULLHOUSE;
    else return HandType.THREEOFAKIND;
  }
  else if (countFirstCard === 2) {
    const otherCards = cards.match(new RegExp(`[^${cards.at(0)}]`, 'g')) ?? [];
    // console.log(otherCards);
    assert(otherCards.length === 3, `Found odd hand`);
    if (otherCards[0] === otherCards[1] && otherCards[0] === otherCards[2]) return HandType.FULLHOUSE;
    else if (otherCards[0] === otherCards[1] || otherCards[1] === otherCards[2] || otherCards[0] === otherCards[2]) return HandType.TWOPAIR;
    else return HandType.ONEPAIR;
  }
  else {
    const countSecondCard = cards.match(new RegExp(`${cards.at(1)}`, 'g'))?.length;
    if (countSecondCard === 4) return HandType.FOUROFAKIND;
    else if (countSecondCard === 3) return HandType.THREEOFAKIND;
    else if (countSecondCard === 2) {
      // Get remaining cards that don't match either the 1st or 2nd card of the hand
      const otherCards = cards.substring(2).match(new RegExp(`[^${cards.at(1)}]`, 'g')) ?? [];
      // console.log(otherCards);
      assert(otherCards.length === 2, `Found odd hand`);
      if (otherCards[0] === otherCards[1]) return HandType.TWOPAIR;
      else return HandType.ONEPAIR;
    }
    else {
      const countThirdCard = cards.match(new RegExp(`${cards.at(2)}`, 'g'))?.length;
      if (countThirdCard === 3) return HandType.THREEOFAKIND;
      else if (countThirdCard === 2) return HandType.ONEPAIR;
      else if (cards.at(3) === cards.at(4)) return HandType.ONEPAIR;
      else return HandType.HIGHCARD;
    }
  }
}

export function getTypePart2(cards: string): HandType {
  if (!cards.includes('J')) return getType(cards);

  // Convert J to most frequently occuring card, because that is guaranteed to maximise the utility of J
  const cardSet = new Set(cards.split(''));
  // In the case of 'JJJJJ', will substitute into Aces for purpose of HandType calculation
  let mostFrequentCard = 'A', mostFrequentCount = 0;
  cardSet.forEach(key => {
    if (key === 'J') return;
    const keyCount = cards.match(new RegExp(key, 'g'))?.length ?? 0;
    if (keyCount > mostFrequentCount) {
      mostFrequentCard = key;
      mostFrequentCount = keyCount;
    }
  });
  // console.log(cards);
  return getType(cards.replace(/J/g, mostFrequentCard));
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

export function getCardValuePart2(card: string): number {
  return card === 'J'
    ? 1
    : getCardValue(card);
}

export function cardCompare(lhs: string, rhs: string, cardValueFn: (card: string) => number): number {
  let difference = cardValueFn(lhs[0]) - cardValueFn(rhs[0]);
  for (let i = 1; i < 5 && difference === 0; i++) {
    difference = cardValueFn(lhs[i]) - cardValueFn(rhs[i]);
  }
  return difference;
}

function getWinnings(hands: Array<Hand>, cardValueFn: (card: string) => number): number {
  let winnings = 0;

  hands.sort((a, b) => {
    // console.log('A: %s %s, B: %s %s', a.cards, a.handType, b.cards, b.handType)
    const typeCompare = a.handType - b.handType;
    return typeCompare !== 0
      ? typeCompare
      : cardCompare(a.cards, b.cards, cardValueFn);
  });
  // console.log(hands);
  
  hands.forEach((hand, index) => {
    winnings += hand.bid * (index + 1);
  });
  
  return winnings;
}

function runDay7Logic(input: string): [number, number] {
  const hands: Array<Hand> = input.split("\n").map(line => {
    const [cards, bidStr] = line.split(' ');
    return {
      cards,
      bid: Number(bidStr),
      handType: getType(cards)
    };
  });

  const result: [number, number] = [0, 0];

  // Part 1 answer
  result[0] = getWinnings(hands, getCardValue);

  // Part 2 answer
  // console.log(hands);
  hands.forEach(hand => {
    hand.handType = getTypePart2(hand.cards);
  });
  // console.log(hands);
  result[1] = getWinnings(hands, getCardValuePart2);

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

  const answerKey = [6440, 5905];

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
