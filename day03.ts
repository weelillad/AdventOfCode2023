import { readFileSync } from "node:fs";

type XYCoords = {
  x: number,
  y: number
};

type PartNumber = {
  value: number,
  posStart: XYCoords,
  posEnd: XYCoords
};

type Part = {
  symbol: string,
  position: XYCoords,
  partNumbers: Array<PartNumber>
};

function runDay3Logic(input: string): [number, number] {
  const schematicRows = input.split("\n");
  const result: [number, number] = [0, 0];

  const digitRegex = /\d\d*/g;
  const symbolRegex = /[^.\w\s]/g;
  const parts: Array<Part> = [];
  let matchResult;

  // Find all symbols
  schematicRows.forEach((row, rowIndex) => {
    while ((matchResult = symbolRegex.exec(row)) !== null) {
      parts.push({
        symbol: matchResult[0],
        position: { x: matchResult.index, y: rowIndex},
        partNumbers: []
      });
    }
  });
  schematicRows.forEach((row, rowIndex) => {
    while ((matchResult = digitRegex.exec(row)) !== null) {
      const posStart = { x: matchResult.index, y: rowIndex }, 
        posEnd = { x: digitRegex.lastIndex, y: rowIndex },
        value = Number(matchResult[0]);
      // console.log(value);

      // assumption: Each number is adjacent to at most one symbol
      const partMatch = parts.find(part => 
        part.position.y >= posStart.y - 1 
        && part.position.y <= posStart.y + 1 
        && part.position.x >= posStart.x - 1 
        && part.position.x <= posEnd.x
      );
      // console.log(partMatch)

      if (partMatch !== undefined) {
        partMatch.partNumbers.push({
          value,
          posStart,
          posEnd
        })
        result[0] += value;
      }
    } 
  });
  
  parts.forEach(part => {
    if (part.symbol === '*' && part.partNumbers.length === 2) {
      result[1] += part.partNumbers[0].value * part.partNumbers[1].value
    }
  })

  // console.log(parts);

  return result;
}

const day3TestData =
  `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

function day3Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [4361, 467835];

  const answer = runDay3Logic(day3TestData);

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

function day3() {
  const input = readFileSync("./input03.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay3Logic(input.trimEnd()));
}

day3Test() && day3();
