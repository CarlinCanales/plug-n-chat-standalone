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

function createNewSingleChat(id: string) {
    const singleChatShell = document.createElement('iframe');
    singleChatShell.setAttribute('data-chatify', '');
    singleChatShell.classList.add(concatClassNameWithBrandName('single-chat'));
    singleChatShell.classList.add(concatClassNameWithBrandName('single-chat'));
    singleChatShell.setAttribute('src', `http://localhost:3000/chat?id=${id}`);
    const wrappedShell = wrapShell(singleChatShell);
    CHATS[id] = wrappedShell;
    return wrappedShell;
}

function closeSingleChat(id: number) {
    CHATS[id].remove();
    delete CHATS[id];
}

const chatifyShell = document.createElement('div');
chatifyShell.classList.add(concatClassNameWithBrandName('shell'));

const messengerDashboard = document.createElement('iframe');
messengerDashboard.classList.add(concatClassNameWithBrandName('dashboard'));
messengerDashboard.setAttribute('data-chatify', '');

const userId = window.sessionStorage.getItem('userId');
if (userId) {
    messengerDashboard.setAttribute('src', `http://localhost:3000/dashboard?id=${userId}`);
} else {
    const newUserId = Math.random().toString().substring(2);
    window.sessionStorage.setItem('userId', newUserId);
    messengerDashboard.setAttribute('src', `http://localhost:3000/dashboard?id=${newUserId}`);
}

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
                // only create new chat if one with that id doesn't already exist
                const {id} = e.data.props;
                if (!CHATS[id as number]) {
                    chatifyShell.appendChild(createNewSingleChat(id));
                }
                break;
        }
    }
})

document.body.appendChild(chatifyShell);
