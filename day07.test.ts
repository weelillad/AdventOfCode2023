import {cardCompare, getCardValuePart2, getTypePart2, HandType} from './day07';

describe('getCardValuePart2', () => {
	test('assigns J a value of 1', () => {
		expect(getCardValuePart2('J')).toBe(1);
	});
	test('assigns A a value of 14', () => {
		expect(getCardValuePart2('A')).toBe(14);
	});
});

describe('getTypePart2', () => {
	test('assigns correct types to hands without J', () => {
		expect(getTypePart2('23456')).toBe(HandType.HIGHCARD);
		expect(getTypePart2('23452')).toBe(HandType.ONEPAIR);
		expect(getTypePart2('23432')).toBe(HandType.TWOPAIR);
		expect(getTypePart2('23252')).toBe(HandType.THREEOFAKIND);
		expect(getTypePart2('23233')).toBe(HandType.FULLHOUSE);
		expect(getTypePart2('44454')).toBe(HandType.FOUROFAKIND);
		expect(getTypePart2('QQQQQ')).toBe(HandType.FIVEOFAKIND);
	});
	test('assigns correct types to hands with J', () => {
		expect(getTypePart2('2345J')).toBe(HandType.ONEPAIR);
		expect(getTypePart2('23J52')).toBe(HandType.THREEOFAKIND);
		expect(getTypePart2('232J3')).toBe(HandType.FULLHOUSE);
		expect(getTypePart2('44J54')).toBe(HandType.FOUROFAKIND);
		expect(getTypePart2('JQQQQ')).toBe(HandType.FIVEOFAKIND);
		expect(getTypePart2('J23J5')).toBe(HandType.THREEOFAKIND);
		expect(getTypePart2('J28K9')).toBe(HandType.ONEPAIR);
	});
});

describe('cardCompare', () => {
	test('compares hands without J correctly', () => {
		expect(cardCompare('T1234', 'T1334', getCardValuePart2)).toBeLessThan(0);
		expect(cardCompare('T1235', 'T1234', getCardValuePart2)).toBeGreaterThan(0);
		expect(cardCompare('478QK', 'T1334', getCardValuePart2)).toBeLessThan(0);
		expect(cardCompare('K1234', 'Q1334', getCardValuePart2)).toBeGreaterThan(0);
	});
	test('compares hands with J correctly', () => {
		expect(cardCompare('T1234', 'J1334', getCardValuePart2)).toBeGreaterThan(0);
		expect(cardCompare('T123J', 'T1234', getCardValuePart2)).toBeLessThan(0);
		expect(cardCompare('478QK', 'J133J', getCardValuePart2)).toBeGreaterThan(0);
		expect(cardCompare('Q1J34', 'Q1334', getCardValuePart2)).toBeLessThan(0);
	});
});