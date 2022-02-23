const sendBtn = document.querySelector('#send');
const messages = document.querySelector('#messages');
const messageBox = document.querySelector('#messageBox');

let userName = prompt('Enter your name:');

let ws = new WebSocket('ws://localhost:8080');

function showMessage(message) {
    const msgContent = document.createElement('div');
    msgContent.classList.add('msg')
    msgContent.innerHTML += `\n\n${message}`;
    messages.scrollTop = messages.scrollHeight;
    messageBox.value = '';
    messages.append(name, msgContent);

    const time = new Date()
        .toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true });
    let timeBox = document.createElement('div');
    timeBox.classList.add('timeBox');
    timeBox.innerHTML = time;
    messages.append(timeBox);
}

ws.onmessage = ({data}) => showMessage(data);

sendBtn.addEventListener('click', () => {
    ws.send(userName+ ':' +messageBox.value);
    showMessage(messageBox.value);
});