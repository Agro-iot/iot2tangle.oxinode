const isYearBisiesto = (year: number): boolean =>
	(year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

export default isYearBisiesto;
