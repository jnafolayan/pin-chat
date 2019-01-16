
export function startWatcher(wss) {
	setInterval(() => {
		wss.clients.forEach(ws => {
			if (!ws.alive) return ws.terminate();

			// ws.alive = false;
			// ws.ping(null, false, true);
		}, 10000);
	});
}

export function setupClient(wss, ws) {
	ws.alive = true;

	ws.on('pong', () => {
		ws.alive = true;
	});

	ws.on('message', (msg: string) => {
		let json;

		try {
			json = JSON.parse(msg);
		} catch (e) {
			console.log('Invalid JSON');
			return;
		}

		const { type, data, broadcast } = json;

		if (broadcast) {
			const obj = {
				type,
				broadcast,
				data: {
					...data,
					count: wss.clients.size
				}
			};
			emitBroadcast(wss, null, JSON.stringify(obj));
		}
	});
}

function emitBroadcast(wss, ws, msg: string) {
	wss.clients.forEach(client => {
		if (client !== ws) {
			client.send(msg);
		}
	});
}