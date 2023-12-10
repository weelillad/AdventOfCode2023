import { readFileSync } from "node:fs";

type CategoryMapRange = {
  destRangeStart: number,
  srcRangeStart: number,
  rangeLength: number
};

type CategoryMap = Array<CategoryMapRange>;

type Almanac = {
  seedList: Array<number>,
  seedToSoilMap: CategoryMap,
  soilToFertilizerMap: CategoryMap,
  fertilizerToWaterMap: CategoryMap,
  waterToLightMap: CategoryMap,
  lightToTempMap: CategoryMap,
  tempToHumidityMap: CategoryMap,
  humidityToLocationMap: CategoryMap
};

function parseSeedList(input: string): Array<number> {
  const [_, seeds] = input.split(': ');
  return seeds.split(' ').map(val => Number(val));
}

function sortCategoryMap(unsortedMap: CategoryMap): CategoryMap {
  return unsortedMap.sort((a, b) => a.srcRangeStart - b.srcRangeStart);
}

function parseMap(mapSegment: string): CategoryMap {
  const lines = mapSegment.split('\n');
  lines.shift(); // remove map header line
  return sortCategoryMap(lines.map(line => {
    const numbers = line.split(' ');
    return {
      destRangeStart: Number(numbers[0]),
      srcRangeStart: Number(numbers[1]),
      rangeLength: Number(numbers[2])
    };
  }));
}

function parseAlmanac(almanacSegments: Array<string>): Almanac {
  if (almanacSegments.length !== 8) {
    throw new Error('Input error: missing map?');
  }
  return {
    seedList: parseSeedList(almanacSegments[0]),
    seedToSoilMap: parseMap(almanacSegments[1]),
    soilToFertilizerMap: parseMap(almanacSegments[2]),
    fertilizerToWaterMap: parseMap(almanacSegments[3]),
    waterToLightMap: parseMap(almanacSegments[4]),
    lightToTempMap: parseMap(almanacSegments[5]),
    tempToHumidityMap: parseMap(almanacSegments[6]),
    humidityToLocationMap: parseMap(almanacSegments[7])
  };
}

function traverseCategoryMap(categoryMap: CategoryMap, inputNum: number): number {
  const coveringRange = categoryMap.find(range => inputNum >= range.srcRangeStart && inputNum < range.srcRangeStart + range.rangeLength);
  if (coveringRange !== undefined) {
    return coveringRange.destRangeStart + (inputNum - coveringRange.srcRangeStart);
  }
  return inputNum;
}

function runDay5Logic(input: string): [number, number] {
  const almanacSegments = input.split("\n\n");
  const result: [number, number] = [Number.MAX_VALUE, 0];

  const almanac: Almanac = parseAlmanac(almanacSegments);
  //console.log(almanac);

  // Part 1 answer
  almanac.seedList.forEach(seed => {
    const soil = traverseCategoryMap(almanac.seedToSoilMap, seed);
    const fertilizer = traverseCategoryMap(almanac.soilToFertilizerMap, soil);
    const water = traverseCategoryMap(almanac.fertilizerToWaterMap, fertilizer);
    const light = traverseCategoryMap(almanac.waterToLightMap, water);
    const temp = traverseCategoryMap(almanac.lightToTempMap, light);
    const humidity = traverseCategoryMap(almanac.tempToHumidityMap, temp);
    const location = traverseCategoryMap(almanac.humidityToLocationMap, humidity);
    // console.log(`Seed ${seed}, soil ${soil}, fertilizer ${fertilizer}, water ${water}, light ${light}, temperature ${temp}, humidity ${humidity}, location ${location}`);

    result[0] = Math.min(result[0], location);
  })

  return result;
}

const day5TestData =
  `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

function day5Test(): boolean {
  console.log("\nTEST\n");

  const answerKey = [35, 0];

  const answer = runDay5Logic(day5TestData);

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

function day5() {
  const input = readFileSync("./input05.txt", "utf8");

  console.log("\nACTUAL\n");

  console.log(runDay5Logic(input.trimEnd()));
}

day5Test() && day5();
