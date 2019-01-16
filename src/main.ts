(function() {
	document.addEventListener('DOMContentLoaded', setup, false);

	const loginPage: HTMLElement = document.querySelector('.login');
	const chatRoom: HTMLElement = document.querySelector('.room');
	const clientsCounter: HTMLElement = document.querySelector('.clients-count');
	const messages: HTMLElement = document.querySelector('.messages');
	const userMsg: HTMLInputElement = document.querySelector('#userMsg');


	let username: string = '';
	let socket: WebSocket;
	let socketOpen: boolean = false;
	const onConnectedCallbacks = [];

	function setup() {
		setupDOM();
		setupWebSocket();
	}

	function setupDOM() {
		const loginEl: HTMLInputElement = document.querySelector('#loginForm');

		loginEl.addEventListener('submit', () => {
			const input: HTMLInputElement = document.querySelector('#username');
			username = input.value;

			loginPage.classList.remove('active');
			chatRoom.classList.add('active');

			waitForConnection(() => send({
				broadcast: true,
				type: 'join',
				data: {
					username
				}
			}));
		});

		userMsg.addEventListener('keypress', function(evt) {
			const value = this.value;

			if (evt.key.toLowerCase() === 'enter') {
				this.value = '';

				waitForConnection(() => send({
					broadcast: true,
					type: 'msg',
					data: {
						username,
						msg: value
					}
				}));
			}
		}, true);
	}

	function pushMessage(msg: string, who: string) {
		const className: string = who === username ? 'own' : who === 'cpu' ? 'cpu' : 'other';
		const by: string = `<span class="by">${who}</span>`;
		messages.innerHTML += `
			<div class="msg ${className}">
				${who !== 'cpu' ? by : ''}
				<span class="body">${msg}</span>
			</div>
		`;
	}

	function setupWebSocket() {
		// const WebSocket = window.WebSocket
			// || window.MozWebSocket;

		if (!WebSocket) return;

		socket = new WebSocket('ws://localhost:8080');

		socket.onopen = onSocketOpen;
		socket.onclose = onSocketClose;
		socket.onmessage = onSocketMessage;

		function onSocketOpen() {
			socketOpen = true;
			onConnectedCallbacks.forEach(cb => cb());
			console.log('Opened...');
		}

		function onSocketClose() {
			socketOpen = false;

		}

		function onSocketMessage({ data: eventData }) {
			const { type, data } = JSON.parse(eventData);

			if (type === 'join') {
				pushMessage(`${data.username === username ? 'You' : data.username} joined the chat.`, 'cpu');
				clientsCounter.innerHTML = data.count;
			} else if (type === 'msg') {
				pushMessage(data.msg, data.username);
			}

			console.log(eventData);
		}
	}

	function waitForConnection(cb: () => void) {
		if (socketOpen) cb();
		else onConnectedCallbacks.push(cb);
	}

	function send(obj: object) {
		socket.send(JSON.stringify(obj));
	}
})();