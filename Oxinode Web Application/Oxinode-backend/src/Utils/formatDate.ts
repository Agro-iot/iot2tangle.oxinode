export const formatDate = (date: Date): string => {
	const hour = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	const seconds = date.getSeconds().toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const month = date.getMonth().toString().padStart(2, '0');
	const year = date.getFullYear().toString().padStart(2, '0');

	return `${hour}:${minutes}:${seconds} ${day}/${month}/${year}`;
};
