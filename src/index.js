import OpenAI from 'openai';
import dotenv from 'dotenv';
import crypto from 'node:crypto';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const systemPrompt = `You are a voice assistant called GPT. You will be presented with transcriptions of a multi-user voice channel, in the form of (<userId>,<username>):<text>. Users will try to start a conversation with you by directly referencing you e.g.'Hey GPT', or expect your response by replying to your previous response. If you feel they are expecting a response from you, output your response. Otherwise do not call any tool and output <NULL>.

To make your response visible to the user, you have to call the 'reply' tool. You have two methods of responding, by voice output or by text channel. Normally you should use the voice channel to reply to users. If your reply include code blocks, email templates or if the user explicitly tells you to output to the text channel, print them to the text channel and tell the user via voice to check the text channel. 

Try to be friendly, casual, natural and human-like. `;

const seed = 8942931137 || crypto.randomInt(1e10);

const result = await openai.chat.completions.create({
  messages: [{
    role: 'system',
    content: systemPrompt
  }, {
    role: 'user',
    content: '(01, Adam): Hey GPT'
  }],
  model: 'gpt-4o',
  tools: [{
    type: 'function',
    function: {
      name: 'reply',
      description: 'Reply to a user in the transcript. This is the only method to let your response be seen by the users.',
      parameters: {
        'type': 'object',
        'properties': {
          'text': {
            'type': 'string',
            'description': 'Your output to the text channel.'
          },
          'voice': {
            'type': 'object',
            'properties': {
              'receipents': {
                'type': 'array',
                'items': {
                  'type': 'string',
                },
                'description': 'UserIds of users you are replying to.',
              },
              'transcription': {
                'type': 'string',
                'description': 'Content of your voice reply. '
              }
            },
            'description': 'You output to the voice channel. ',
            'required': ['recepients', 'transcription']
          },
        },
        'required': ['voice'],
      }
    }
  }],
  temperature: 0,
  seed,
});

console.log(result.choices[0], result.choices[0].message.tool_calls);
console.log('seed', seed);