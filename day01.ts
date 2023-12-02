import { readFileSync } from "node:fs";

function runDay1Logic(input: string): [number, number] {
  const calibrationSum: number = input.split("\n").reduce((calibrationSum, line) => {
    const matches = line.match(/\d/g) || [0];
    calibrationSum += Number(matches.at(0)) * 10;
    calibrationSum += Number(matches.at(-1));
    return calibrationSum;
  }, 0);

  return [calibrationSum, 0];
}

const day1TestData =
  `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

function day1Test() {
  console.log("\nTEST\n");

  const answerKey = [142, 0];

  const answer = runDay1Logic(day1TestData);

  answer[0] === answerKey[0]
    ? console.log("Part 1 Test passed!!")
    : console.log(`PART 1 TEST FAILED!! Expected answer: ${answerKey[0]}. Received answer: ${answer[0]}`);

  answer[1] === answerKey[1]
    ? console.log("Part 2 Test passed!!")
    : console.log(`PART 2 TEST FAILED!! Expected answer: ${answerKey[1]}. Received answer: ${answer[1]}`);
}

function day1() {
  const input = readFileSync("./input01.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay1Logic(input.trimEnd()));
}

day1Test();
day1();
