# gear-help
[![Build Status](https://travis-ci.org/hubot-js/gear-help.svg?branch=master)](https://travis-ci.org/hubot-js/gear-help)  [![npm](https://img.shields.io/npm/v/gear-help.svg)](https://www.npmjs.com/package/gear-help)   [![Coverage Status](https://coveralls.io/repos/github/hubot-js/gear-help/badge.svg?branch=master)](https://coveralls.io/github/hubot-js/gear-help?branch=master)   [![Code Climate](https://img.shields.io/codeclimate/github/hubot-js/gear-help.svg)](https://codeclimate.com/github/hubot-js/gear-help)  [![dependencies Status](https://david-dm.org/hubot-js/gear-help/status.svg)](https://david-dm.org/hubot-js/gear-help)  [![devDependencies Status](https://david-dm.org/hubot-js/gear-help/dev-status.svg)](https://david-dm.org/hubot-js/gear-help?type=dev)

> A Hubot Gear for enable help and show available commands 

This is a gear to add to [hubot.js](https://github.com/hubot-js/hubot.js) the ability to show help with available commands. If you do not know the hubot.js or do not know what they are gears like this [click here](https://github.com/hubot-js/hubot.js/blob/master/README.md) for more details.

![hubot-help-gif](media/help.gif)

## Usage

When hubot.js starts you can ask for help. The help command will show commands from all active gears.

```
hubot help
```

![hubot-private-help](media/help.png)

Help should be asked directly to the hubot. If you ask help in channel, will receive a warning.

![hubot-public-help](media/private-help.png)

## Development setup
- Fork and clone this project
- In the main directory run ```npm install```to install dependencies.
- Write your code.
- To run tests use ```npm test``` command

## Meta
Robson Bittencourt - @rluizv - robson.luizv@gmail.com

Distributed under the MIT license. See [LICENSE](LICENSE) for more information.

https://github.com/hubot-js/gear-help
