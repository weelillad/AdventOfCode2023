import { readFileSync } from "node:fs";

type NumRange = {
  start: number,
  length: number
};

type CategoryMapRange = {
  destStart: number,
  srcStart: number,
  length: number
};

type CategoryMap = Array<CategoryMapRange>;

type Almanac = {
  seedList: Array<number>,
  seedRangeList: Array<NumRange>,
  seedToSoilMap: CategoryMap,
  soilToFertilizerMap: CategoryMap,
  fertilizerToWaterMap: CategoryMap,
  waterToLightMap: CategoryMap,
  lightToTempMap: CategoryMap,
  tempToHumidityMap: CategoryMap,
  humidityToLocationMap: CategoryMap
};

function sortCategoryMap(unsortedMap: CategoryMap): CategoryMap {
  return unsortedMap.sort((a, b) => a.srcStart - b.srcStart);
}

function parseMap(mapSegment: string): CategoryMap {
  const lines = mapSegment.split('\n');
  lines.shift(); // remove map header line
  return sortCategoryMap(lines.map(line => {
    const numbers = line.split(' ');
    return {
      destStart: Number(numbers[0]),
      srcStart: Number(numbers[1]),
      length: Number(numbers[2])
    };
  }));
}

function convertSeedListToSeedRangeList(seedList: Array<number>): Array<NumRange> {
  const seedRangeList: Array<NumRange> = [];
  for (let i = 1; i < seedList.length; i += 2) {
    seedRangeList.push({
      start: seedList[i-1],
      length: seedList[i]
    });
  }
  return seedRangeList;
}

function parseSeedList(input: string): Array<number> {
  const [_, seeds] = input.split(': ');
  return seeds.split(' ').map(val => Number(val));
}

function parseAlmanac(almanacSegments: Array<string>): Almanac {
  if (almanacSegments.length !== 8) {
    throw new Error('Input error: missing map?');
  }
  const seedList = parseSeedList(almanacSegments[0]);
  return {
    seedList,
    seedRangeList: convertSeedListToSeedRangeList(seedList),
    seedToSoilMap: parseMap(almanacSegments[1]),
    soilToFertilizerMap: parseMap(almanacSegments[2]),
    fertilizerToWaterMap: parseMap(almanacSegments[3]),
    waterToLightMap: parseMap(almanacSegments[4]),
    lightToTempMap: parseMap(almanacSegments[5]),
    tempToHumidityMap: parseMap(almanacSegments[6]),
    humidityToLocationMap: parseMap(almanacSegments[7])
  };
}

function getCoveringRange(categoryMap: CategoryMap, inputNum: number): CategoryMapRange | undefined {
  return categoryMap.find(range => inputNum >= range.srcStart && inputNum < range.srcStart + range.length);
}

function traverseCategoryMap(categoryMap: CategoryMap, inputNum: number): number {
  const coveringRange = getCoveringRange(categoryMap, inputNum);
  return coveringRange !== undefined
    ? coveringRange.destStart + (inputNum - coveringRange.srcStart)
    : inputNum;
}

function getNextDestRange(categoryMap: CategoryMap, srcRange: NumRange): NumRange {
  const coveringRange = getCoveringRange(categoryMap, srcRange.start);
  if (coveringRange === undefined) {
    // generate default range definition to be returned
    const nextRange = categoryMap.find(mapRange => mapRange.srcStart > srcRange.start);
    return { 
      start: srcRange.start, 
      length: nextRange !== undefined
        ? nextRange.srcStart - srcRange.start
        : srcRange.length 
    };
  }
  const rangeOffset = srcRange.start - coveringRange.srcStart;
  return {
    start: coveringRange.destStart + rangeOffset,
    length: Math.min(coveringRange.length - rangeOffset, srcRange.length)
  };
}

function getDestRanges(categoryMap: CategoryMap, srcRanges: Array<NumRange>): Array<NumRange> {
  const destRanges: Array<NumRange> = [];
  srcRanges.forEach(range => {
    let destRange = getNextDestRange(categoryMap, range);
    // console.log('Source range %o, 1st dest range %o', range, destRange)
    destRanges.push(destRange);
    let remainingRange = {
      start: range.start + destRange.length,
      length: range.length - destRange.length
    };
    while (remainingRange.length > 0) {
        destRange = getNextDestRange(categoryMap, remainingRange);
        // console.log('Leftover range %o, next dest range %o', remainingRange, destRange)
        destRanges.push(destRange);
        remainingRange = {
          start: remainingRange.start + destRange.length,
          length: remainingRange.length - destRange.length
        };
    }
  });
  return destRanges;
}

function runDay5Logic(input: string): [number, number] {
  const almanacSegments = input.split("\n\n");
  const result: [number, number] = [Number.MAX_VALUE, 0];

  const almanac: Almanac = parseAlmanac(almanacSegments);
  // console.log(almanac);

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

  // Part 2 answer
  /*
    A range of seeds will be mapped into one or more ranges of soils, this then recurses across the rest of the 7 maps
    The lowest location then has to correspond to the start of a range, because all subsequent numbers in the range are larger
  */
  // console.log('Seed To Soil');
  let destRanges = getDestRanges(almanac.seedToSoilMap, almanac.seedRangeList);
  // console.log('Soil To Fertilizer');
  destRanges = getDestRanges(almanac.soilToFertilizerMap, destRanges);
  // console.log('Fertilizer To Water');
  destRanges = getDestRanges(almanac.fertilizerToWaterMap, destRanges);
  // console.log('Water To Light');
  destRanges = getDestRanges(almanac.waterToLightMap, destRanges);
  // console.log('Light To Temp');
  destRanges = getDestRanges(almanac.lightToTempMap, destRanges);
  // console.log('Temp To Humidity');
  destRanges = getDestRanges(almanac.tempToHumidityMap, destRanges);
  // console.log('Humidity To Location');
  destRanges = getDestRanges(almanac.humidityToLocationMap, destRanges);
  result[1] = Math.min(...destRanges.map(range => range.start));

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

  const answerKey = [35, 46];

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
