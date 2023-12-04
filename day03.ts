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

function isPartNumber(posStart: XYCoords, posEnd: XYCoords, symbols: Array<XYCoords>): boolean {
  return symbols.filter(symbol => 
      symbol.y >= posStart.y - 1 
      && symbol.y <= posStart.y + 1 
      && symbol.x >= posStart.x - 1 
      && symbol.x <= posEnd.x
    ).length > 0;
}

function runDay3Logic(input: string): [number, number] {
  const schematicRows = input.split("\n");
  const result: [number, number] = [0, 0];

  const digitRegex = /\d\d*/g;
  const partNums: Array<PartNumber> = [];
  const symbolRegex = /[^.\w\s]/g;
  const symbols: Array<XYCoords> = [];
  let matchResult;
  schematicRows.forEach((row, rowIndex) => {
    while ((matchResult = symbolRegex.exec(row)) !== null) {
      symbols.push({
        x: matchResult.index,
        y: rowIndex
      });
    }
  });
  schematicRows.forEach((row, rowIndex) => {
    while ((matchResult = digitRegex.exec(row)) !== null) {
      const posStart = { x: matchResult.index, y: rowIndex }, 
        posEnd = { x: digitRegex.lastIndex, y: rowIndex };
      if (isPartNumber(posStart, posEnd, symbols)) {
        // partNums.push({
        //   value: Number(matchResult[0]),
        //   posStart,
        //   posEnd
        // });
        result[0] += Number(matchResult[0]);
      }
    } 
  });

  // console.log(symbols, partNums);

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

  const answerKey = [4361, 0];

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
