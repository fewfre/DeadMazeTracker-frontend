export const padStart = (str:string|number, max: number=2) => str.toString().padStart(max, "0");

// https://stackoverflow.com/a/37399351/1411473
export function getDateWithUTCOffset(inputTzOffset: number): Date {
	var now = new Date(); // get the current time

	var currentTzOffset = -now.getTimezoneOffset() / 60 // in hours, i.e. -4 in NY
	var deltaTzOffset = inputTzOffset - currentTzOffset; // timezone diff

	var nowTimestamp = now.getTime(); // get the number of milliseconds since unix epoch
	var deltaTzOffsetMilli = deltaTzOffset * 1000 * 60 * 60; // convert hours to milliseconds (tzOffsetMilli*1000*60*60)
	var outputDate = new Date(nowTimestamp + deltaTzOffsetMilli) // your new Date object with the timezone offset applied.

	return outputDate;
}

export function copyToClipboard(value:string) {
	if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
		// modern API available
		return navigator.clipboard.writeText(value);
	}
	return new Promise<void>((resolve, reject) => {
		var tempInput = document.createElement("input");
		tempInput.style = "position: absolute; left: -1000px; top: -1000px";
		tempInput.value = value;
		document.body.appendChild(tempInput);
		tempInput.select();
		try {
			document.execCommand('copy');
			resolve();
		}
		catch (err) {
			reject(err);
		}
		finally {
			document.body.removeChild(tempInput);
		}
	});
}

export async function loadScript(url:string) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;

        script.onload = () => {
            resolve(`Script loaded: ${url}`);
        };

        script.onerror = () => {
            reject(new Error(`Failed to load script: ${url}`));
        };

        document.head.appendChild(script);
    });
}