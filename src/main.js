(function () {
    document.addEventListener('DOMContentLoaded', setup, false);
    var loginPage = document.querySelector('.login');
    var chatRoom = document.querySelector('.room');
    var clientsCounter = document.querySelector('.clients-count');
    var messages = document.querySelector('.messages');
    var userMsg = document.querySelector('#userMsg');
    var username = '';
    var socket;
    var socketOpen = false;
    var onConnectedCallbacks = [];
    function setup() {
        setupDOM();
        setupWebSocket();
    }
    function setupDOM() {
        var loginEl = document.querySelector('#loginForm');
        loginEl.addEventListener('submit', function () {
            var input = document.querySelector('#username');
            username = input.value;
            loginPage.classList.remove('active');
            chatRoom.classList.add('active');
            waitForConnection(function () { return send({
                broadcast: true,
                type: 'join',
                data: {
                    username: username
                }
            }); });
        });
        userMsg.addEventListener('keypress', function (evt) {
            var value = this.value;
            if (evt.key.toLowerCase() === 'enter') {
                this.value = '';
                waitForConnection(function () { return send({
                    broadcast: true,
                    type: 'msg',
                    data: {
                        username: username,
                        msg: value
                    }
                }); });
            }
        });
    }
    function pushMessage(msg, who) {
        var className = who === username ? 'own' : who === 'cpu' ? 'cpu' : 'other';
        var by = "<span class=\"by\">" + who + "</span>";
        messages.innerHTML += "\n\t\t\t<div class=\"msg " + className + "\">\n\t\t\t\t" + (who !== 'cpu' ? by : '') + "\n\t\t\t\t<span class=\"body\">" + msg + "</span>\n\t\t\t</div>\n\t\t";
    }
    function setupWebSocket() {
        // const WebSocket = window.WebSocket
        // || window.MozWebSocket;
        if (!WebSocket)
            return;
        socket = new WebSocket('ws://localhost:8080');
        socket.onopen = onSocketOpen;
        socket.onclose = onSocketClose;
        socket.onmessage = onSocketMessage;
        function onSocketOpen() {
            socketOpen = true;
            onConnectedCallbacks.forEach(function (cb) { return cb(); });
            console.log('Opened...');
        }
        function onSocketClose() {
            socketOpen = false;
        }
        function onSocketMessage(_a) {
            var eventData = _a.data;
            var _b = JSON.parse(eventData), type = _b.type, data = _b.data;
            if (type === 'join') {
                pushMessage((data.username === username ? 'You' : data.username) + " joined the chat.", 'cpu');
                clientsCounter.innerHTML = data.count;
            }
            else if (type === 'msg') {
                pushMessage(data.msg, data.username);
            }
            console.log(eventData);
        }
    }
    function waitForConnection(cb) {
        if (socketOpen)
            cb();
        else
            onConnectedCallbacks.push(cb);
    }
    function send(obj) {
        socket.send(JSON.stringify(obj));
    }
})();
