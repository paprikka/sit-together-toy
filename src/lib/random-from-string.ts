export const randomFromString = (str: string) => {
	let sum = 0;
	for (let i = 0; i < str.length; i++) {
		sum += str.charCodeAt(i);
	}
	const seed = sum % str.length;
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
};

export const randomRangeFromString = (str: string, min: number, max: number) =>
	Math.floor(randomFromString(str) * (max - min + 1)) + min;
