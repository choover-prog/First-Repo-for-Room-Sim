export async function chat(messages){
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  if(!key) throw new Error('OpenAI key missing');
  const res = await fetch('https://api.openai.com/v1/chat/completions',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Authorization':`Bearer ${key}`
    },
    body:JSON.stringify({model:'gpt-3.5-turbo',messages})
  });
  const data = await res.json();
  return data.choices?.[0]?.message || {role:'assistant',content:'(no response)'};
}
