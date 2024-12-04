import './style.scss'

const BRAND_NAME = 'chatify';

function concatClassNameWithBrandName(name: string) {
    return `${BRAND_NAME}-${name}`;
}

function wrapShell(shell: HTMLElement) {
    const wrapper = document.createElement('div');
    wrapper.classList.add(concatClassNameWithBrandName('shell-wrapper'));
    wrapper.classList.add('open');
    wrapper.append(shell);
    return wrapper;
}

const chatifyShell = document.createElement('div');
chatifyShell.classList.add(concatClassNameWithBrandName('shell'));

const messengerDashboard = document.createElement('iframe');
messengerDashboard.classList.add(concatClassNameWithBrandName('dashboard'));
messengerDashboard.setAttribute('data-chatify', '');
messengerDashboard.setAttribute('src', 'http://localhost:3000/dashboard');

const singleChatShell = document.createElement('iframe');
singleChatShell.setAttribute('data-chatify', '');
singleChatShell.classList.add(concatClassNameWithBrandName('single-chat'));
singleChatShell.classList.add(concatClassNameWithBrandName('single-chat'));
singleChatShell.setAttribute('src', 'http://localhost:3000/chat');

chatifyShell.appendChild(wrapShell(messengerDashboard));
chatifyShell.appendChild(wrapShell(singleChatShell));

window.addEventListener('message', (e) => {
    if (e.data.source === 'chatify') {
        if (e.data.message === 'toggle dashboard') {
            messengerDashboard.closest(`.${concatClassNameWithBrandName(('shell-wrapper'))}`)?.classList.toggle('open');
        }
        if (e.data.message === 'create new single chat') {
            chatifyShell.appendChild(wrapShell(singleChatShell));
        }
    }

})

document.body.appendChild(chatifyShell);
