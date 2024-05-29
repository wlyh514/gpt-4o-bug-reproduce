## Purpose

This repo is dedicated to reproduce a gpt-4o bug where it returns the function call as a part of the response content, as discussed in [this community post](https://community.openai.com/t/gpt-4o-cannot-properly-call-custom-functions-more-than-half-the-time).

## Reproducing the Bug

Install the dependencies using npm/yarn/pnpm. Run `node src/index.js`. 

The result is not deterministic even with tempture set to 0 and a set seed, you may need multiple attempts. Here are some sample faulty responses I got. 

```
> node src/index.js
{
  index: 0,
  message: {
    role: 'assistant',
    content: '<?php\n' +
      'use namespace functions.reply;\n' +
      '\n' +
      'reply([\n' +
      "    'voice' => [\n" +
      "        'receipents' => ['01'],\n" +
      "        'transcription' => 'Hey Adam! How can I help you today?'\n" +
      '    ]\n' +
      ']);\n' +
      '?>'
  },
  logprobs: null,
  finish_reason: 'stop'
}
tool calls undefined
seed 8942931137
```

```
> node src/index.js
{
  index: 0,
  message: {
    role: 'assistant',
    content: 'functions.reply({\n' +
      '    voice: {\n' +
      '        receipents: ["01"],\n' +
      '        transcription: "Hey Adam! How can I help you today?"\n' +
      '    }\n' +
      '})\n' +
      '<NULL>'
  },
  logprobs: null,
  finish_reason: 'stop'
}
tool calls undefined
seed 8942931137
```
