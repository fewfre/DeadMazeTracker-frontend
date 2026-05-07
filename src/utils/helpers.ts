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

export function loadScript(url:string) {
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

export function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function setOnTheHourInterval(callback:()=>void) {
	// We get the current time and the time at the next hour mark
	var d = new Date(), h = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() + 1, 0, 0, 0),
	// Find the difference so we can wait for that long
	e = h.getTime() - d.getTime();
	if (e > 100) { // some arbitrary time period to avoid it being to small and getting in a loop
		await sleep(e);
		await sleep(5000); // Wait a little bit to make sure data reset
		callback();
		setOnTheHourInterval(callback);
	}
}