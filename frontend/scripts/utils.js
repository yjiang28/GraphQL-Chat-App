const processUsername = username => {
	const res = username
		.toLowerCase()
		.split(" ")
		.reduce((acc, part) => {
			const letters = part.split("");
			letters[0] = letters[0].toUpperCase();
			acc.push(letters.join(""));
			return acc;
		}, [])
		.join(" ");
	return res;
};

export { processUsername };
