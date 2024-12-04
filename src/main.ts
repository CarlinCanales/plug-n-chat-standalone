import './style.scss'

const BRAND_NAME = 'chatify';
const CHATS: { [key: string]: HTMLElement } = {};

function concatClassNameWithBrandName(name: string) {
    return `${BRAND_NAME}-${name}`;
}

function wrapShell(shell: HTMLElement) {
    const wrapper = document.createElement('div');
    wrapper.classList.add(concatClassNameWithBrandName('shell-wrapper'));
    wrapper.append(shell);
    return wrapper;
}

function createNewSingleChat({id, name}) {
    const singleChatShell = document.createElement('iframe');
    singleChatShell.setAttribute('data-chatify', '');
    singleChatShell.classList.add(concatClassNameWithBrandName('single-chat'));
    singleChatShell.classList.add(concatClassNameWithBrandName('single-chat'));
    singleChatShell.setAttribute('src', `http://localhost:3000/chat?id=${id}`);
    const wrappedShell = wrapShell(singleChatShell);
    CHATS[id] = wrappedShell;
    return wrappedShell;
}

function closeSingleChat(id: string) {
    CHATS[id].remove();
    delete CHATS[id];
}

const chatifyShell = document.createElement('div');
chatifyShell.classList.add(concatClassNameWithBrandName('shell'));

const messengerDashboard = document.createElement('iframe');
messengerDashboard.classList.add(concatClassNameWithBrandName('dashboard'));
messengerDashboard.setAttribute('data-chatify', '');
messengerDashboard.setAttribute('src', 'http://localhost:3000/dashboard');

chatifyShell.appendChild(wrapShell(messengerDashboard));

window.addEventListener('message', (e) => {
    if (e.data.source === 'chatify') {
        switch (e.data.message) {
            case 'toggle dashboard':
                messengerDashboard.closest(`.${concatClassNameWithBrandName(('shell-wrapper'))}`)?.classList.toggle('open');
                break;
            case 'toggle chat':
                CHATS[e.data.id].closest(`.${concatClassNameWithBrandName(('shell-wrapper'))}`)?.classList.toggle('open');
                break;
            case 'close chat':
                closeSingleChat(e.data.id);
                break;
            case 'create new single chat':
                chatifyShell.appendChild(createNewSingleChat(e.data.props));
                break;
        }
    }
})

document.body.appendChild(chatifyShell);
