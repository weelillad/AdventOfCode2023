import { readFileSync } from "node:fs";

type Race = {
  time: number,
  distance: number
};

function findNumOfWinningWays(race: Race): number {
  /* 
    Objective is to find minimum and maximum t0 such that t0 * (tRace - t0) > distance
    This can be converted into finding the solution for the quadratic equation -t0^2 + tRace*t0 - distance = 0
    Then find the difference between the smaller t0 rounded up, and the larger t0 rounded down.
  */ 

  // ASSUMPTION: roots of the equation are always real and different
  const discriminant = race.time * race.time - 4 * -1 * -race.distance;
  // Alter the math so that if either root is an integer, get the adjecent integer that has a positive result
  const minTime = Math.floor((-race.time + Math.sqrt(discriminant)) / (2 * -1)) + 1;
  const maxTime = Math.ceil((-race.time - Math.sqrt(discriminant)) / (2 * -1)) - 1;
  // //console.log(maxTime, minTime);
  return maxTime - minTime + 1;

}

function runDay6Logic(input: string): [number, number] {
  const [timeString, distString] = input.split("\n");
  const times = timeString.substring(timeString.search(/\d/)).split(/\s\s*/).map(str => Number(str));
  const distances = distString.substring(distString.search(/\d/)).split(/\s\s*/).map(str => Number(str));

  const races: Array<Race> = [];
  for (let i = 0; i < times.length; i++) {
    races.push({ time: times[i], distance: distances[i] });
  }
  //console.log(races);

  const result: [number, number] = [1, 0];

  // Part 1 answer
  races.forEach(race => {
    result[0] *= findNumOfWinningWays(race);
  })

  // Part 2 answer
  const bigRace = {
    time: Number(timeString.substring(timeString.search(/\d/)).replaceAll(/\s/g, '')),
    distance: Number(distString.substring(distString.search(/\d/)).replaceAll(/\s/g, ''))
  }
  //console.log(bigRace);
  result[1] = findNumOfWinningWays(bigRace);

  return result;
}

const day6TestData =
  `Time:      7  15   30
Distance:  9  40  200`;

function day6Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [288, 71503];

  const answer = runDay6Logic(day6TestData);
  
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

function day6() {
  const input = readFileSync("./input06.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay6Logic(input.trimEnd()));
}

day6Test() && day6();
