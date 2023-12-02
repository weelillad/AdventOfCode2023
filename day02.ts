import { readFileSync } from "node:fs";

type TriColor = {
  red: number,
  green: number,
  blue: number
};

function newTriColor(): TriColor {
  return {
    red: 0,
    green: 0,
    blue: 0
  };
}

function getMaxTriColor(left: TriColor, right: TriColor): TriColor {
  return {
    red: left.red > right.red ? left.red : right.red,
    green: left.green > right.green ? left.green : right.green,
    blue: left.blue > right.blue ? left.blue : right.blue,
  }
}

function parseCountColor(cubeDescription: string): [number, string] {
  const [countStr, color, ...rest] = cubeDescription.split(' ');
  if (rest.length > 0) console.warn('Unexpected string format: %s', cubeDescription);
  return [Number(countStr), color];
}

function parseCubeSet(cubeSet: string): TriColor {
  return cubeSet.split(', ').reduce((setTriColor, str) => {
    const [count, color] = parseCountColor(str);
    switch (color) {
    case 'red':
      setTriColor.red = count;
      break;
    case 'green':
      setTriColor.green = count;
      break;
    case 'blue':
      setTriColor.blue = count;
      break;
    default:
      console.error('ERROR: Unknown color %s', color);
    }
    return setTriColor;
  }, newTriColor());
}

function parseGameInfo(gameLine: string): [number, TriColor] {
  const [idStr, revealsStr] = gameLine.substring(5).split(': ');
  const reveals = revealsStr.split('; ').map(revealLine => {
    return parseCubeSet(revealLine);
  });

  let maxCubes = newTriColor();
  reveals.forEach(reveal => {
    maxCubes = getMaxTriColor(reveal, maxCubes);
  })

  return [Number(idStr), maxCubes];
}

function runDay2Logic(input: string): [number, number] {
  const gameData = input.split('\n').map(gameLine => parseGameInfo(gameLine));
  const gameSum: number = gameData.reduce((sumPossible, [id, maxCubes]) => {
    return (maxCubes.red <= day2Criteria.red && maxCubes.green <= day2Criteria.green && maxCubes.blue <= day2Criteria.blue)
      ? sumPossible + id
      : sumPossible;
  }, 0)
  const powerSum: number = gameData.reduce((sumPower, [_, maxCubes]) => {
    return sumPower + maxCubes.red * maxCubes.green * maxCubes.blue;
  }, 0);

  return [gameSum, powerSum];
}

const day2TestData =
  `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

const day2Criteria: TriColor = {
  red: 12,
  green: 13,
  blue: 14
};

function day2Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [8, 2286];

  const answer = runDay2Logic(day2TestData);

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

function day2() {
  const input = readFileSync("./input02.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay2Logic(input.trimEnd()));
}

day2Test() && day2();
