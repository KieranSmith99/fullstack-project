console.log("Hello World");

const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const API_URL = "http://localhost:5000/message";
const messagesElement = document.querySelector('.messages');

loadingElement.style.display = '';

listAllMessages();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    const myMessage = {
        name,
        content
    }
    
    loadingElement.style.display = '';
    form.style.display = 'none';

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(myMessage),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
        .then(createdMessage => {
            form.reset();
            setTimeout(() => {
                form.style.display = '';
            }, 30000);
            listAllMessages();
        });
});

function listAllMessages() {
    messagesElement.innerHTML = '';
    fetch(API_URL)
        .then(response => response.json())
        .then(messages => {
            messages.reverse();

            messages.forEach(message => {
                const div = document.createElement('div');
                const header = document.createElement('h3');
                header.textContent = message.name;

                const contents = document.createElement('p');
                contents.textContent = message.content;

                const date = document.createElement('small');
                date.textContent = new Date(message.created);

                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);

                messagesElement.appendChild(div);
            });
            loadingElement.style.display = 'none';
    });
}