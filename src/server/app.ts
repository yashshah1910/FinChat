import { startApp } from 'modelence/server';
import finChatModule from './modules/finChatModule';

startApp({
    modules: [finChatModule]
});
