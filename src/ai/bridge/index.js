import { flags } from '../../config/flags.js';
import { chat as localChat } from './local_stub.js';
import { chat as openAIChat } from './openai_bridge.js';

export function getChat(){
  if(flags.aiCloud && import.meta.env.VITE_OPENAI_API_KEY){
    return openAIChat;
  }
  return localChat;
}
