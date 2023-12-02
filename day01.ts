import { readFileSync } from "node:fs";

function parseInteger(inputVal: string | number | undefined): number {
  switch (inputVal) {
  case 'one':
    return 1;
  case 'two':
    return 2;
  case 'three':
    return 3;
  case 'four':
    return 4;
  case 'five':
    return 5;
  case 'six':
    return 6;
  case 'seven':
    return 7;
  case 'eight':
    return 8;
  case 'nine':
    return 9;
  default:
    return Number(inputVal);
  }
}

function getCalibrationValueSum(input: string, regex: RegExp): number {
  return input.split("\n").reduce((calibrationSum, line) => {
    let lastMatch = regex.exec(line);
    if (lastMatch === null) {
      console.error("ERROR: Could not find a number in %s", line);
      return 0;
    }
    // console.log(lastMatch.at(0));
    calibrationSum += parseInteger(lastMatch.at(0)) * 10;
    do {
      regex.lastIndex = lastMatch.index + 1;
      lastMatch = regex.exec(line) ?? lastMatch;
      // console.log(lastMatch.at(0));
    } while (regex.lastIndex > 0);
    calibrationSum += parseInteger(lastMatch.at(0));
    return calibrationSum;
  }, 0);
}

function runDay1Logic(input: string): [number, number] {
  console.log('Part 1');
  const calibrationSumPart1: number = getCalibrationValueSum(input, /\d/g);
  console.log('Part 2');
  const calibrationSumPart2: number = getCalibrationValueSum(input, /\d|one|two|three|four|five|six|seven|eight|nine/g);
  
  return [calibrationSumPart1, calibrationSumPart2];
}

const day1Part1TestData =
  `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

const day1Part2TestData =
  `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

function day1Test() : boolean {
  console.log("\nTEST\n");

  const answerKey = [142, 281];
  const answer = [runDay1Logic(day1Part1TestData)[0], runDay1Logic(day1Part2TestData)[1]];

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

function day1() {
  const input = readFileSync("./input01.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay1Logic(input.trimEnd()));
}

day1Test() && day1();
