export async function chat(messages){
  const last = messages[messages.length-1];
  return { role:'assistant', content:`stub:${last.content}` };
}
