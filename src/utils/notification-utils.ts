export const browserSupportsNotifications = () => "Notification" in window;
export const hasUserEnabledNotifications = () => browserSupportsNotifications() && Notification.permission === "granted";

export async function requestNotificationPermissionIfNeeded() {
	if (!browserSupportsNotifications()) {
		alert("This browser does not support desktop notifications.");
	} else if (Notification.permission === "granted") {
		return true;
	} else if (Notification.permission !== "denied") {
		const permission = await Notification.requestPermission();
		return permission === "granted";
	}
}

interface SendNotificationProps {
	title: string;
	body: string;
	autoClose?: boolean;
}
export function sendNotification({ title, body, autoClose }: SendNotificationProps) {
	if (!hasUserEnabledNotifications()) return;

	try {
		const notification = new Notification(title, { body });

		if(autoClose) {
			setTimeout(() => notification.close(), 5000);
		}
	} catch {
		// Ignore notification failures in unsupported environments or if the user revokes permission.
	}
}