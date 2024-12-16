import './style.scss'

const BRAND_NAME = 'chatify';
const HOST = import.meta.env.VITE_HOST;
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

function createNewSingleChat(userId: string, friendId: string) {
    const singleChatShell = document.createElement('iframe');
    singleChatShell.setAttribute('data-chatify', '');
    singleChatShell.classList.add(concatClassNameWithBrandName('single-chat'));
    singleChatShell.setAttribute('src', `${HOST}/chat?userId=${userId}&friendId=${friendId}`);
    const wrappedShell = wrapShell(singleChatShell);
    wrappedShell.classList.add('open');
    CHATS[friendId] = wrappedShell;
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

// TODO: this is a temporary way to store an id until I build in an account system
const userId = window.sessionStorage.getItem('userId');
if (userId) {
    messengerDashboard.setAttribute('src', `${HOST}/dashboard?userId=${userId}`);
} else {
    const newUserId = Math.random().toString().substring(2);
    window.sessionStorage.setItem('userId', newUserId);
    messengerDashboard.setAttribute('src', `${HOST}/dashboard?userId=${newUserId}`);
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
                const {uid, fid} = e.data;
                if (!CHATS[fid as number]) {
                    chatifyShell.appendChild(createNewSingleChat(uid, fid));
                }
                break;
        }
    }
})

document.body.appendChild(chatifyShell);
