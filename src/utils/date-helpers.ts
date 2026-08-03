/**
 * Converts a string/number into a Date object
 * @param value A number (seconds since 1970) or a string in the format of "YYYY-MM-DD HH:MM:SS" or "YYYY-MM-DDTHH:MM:SSZ" or "YYYY-MM-DDTHH:MM:SS+HH:MM"
 * @returns A Date object or null if the value is invalid
 */
export function parseDate(value:string|number|null|undefined) {
	if (value === null || value === undefined || value === '') return null;
	let date: Date;
	if (typeof value === 'number') {
		date = new Date(value * 1000);
	} else {
		let parsed = value.replace(' ', 'T');
		if (!parsed.endsWith('Z') && !parsed.match(/[+-]\d{2}:?\d{2}$/)) {
			parsed += 'Z';
		}
		date = new Date(parsed);
	}
	if (Number.isNaN(date.valueOf())) return null;
	
	return date;
}

export function secondsSince(date:Date) : number;
export function secondsSince(date:Date|null|undefined) : number|null;
export function secondsSince(date:Date|null|undefined) {
	if (!date) return null;
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
	return diffInSeconds;
}