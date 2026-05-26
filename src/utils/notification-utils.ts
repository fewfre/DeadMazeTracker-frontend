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
}
export function sendNotification({ title, body }: SendNotificationProps) {
	if (!hasUserEnabledNotifications()) return;

	try {
		new Notification(title, { body, icon: "images/site-logo.png" });
	} catch {
		// Ignore notification failures in unsupported environments or if the user revokes permission.
	}
}