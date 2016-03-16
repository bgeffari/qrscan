
//To send toast notification
function sendToastNotification(msg, timer) {
	var notification = document.querySelector('#toast-notification');

	var data = {
		message: msg || "",
		timeout: timer || 2000
	};

	notification.MaterialSnackbar.showSnackbar(data);
}

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('../sw.js', { scope: '/' }).then((reg) => {
		if (reg.installing) {
			console.log('Service worker installing');
			sendToastNotification('App is ready for offline use!', 3000);
		} else if(reg.waiting) {
			console.log('Service worker installed');
		} else if(reg.active) {
			console.log('Service worker active');
		}
	}).catch((error) => {
		console.log('Registration failed with ' + error); // Registration failed
	});
}