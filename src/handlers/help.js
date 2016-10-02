'use strict';

exports.handle = handle;

function handle(hubot, message) {
   let helpMessage = getHelpMessage(hubot, message);
   
   if (helpMessage) {
      hubot.talk(message, helpMessage);   
   }
}

function getHelpMessage(hubot, message) {
   let user = hubot._getUserById(message.user);
   
   if (hubot._isChannelConversation(message)) {
      return publicHelpMessage(hubot, user);
   } 
   
   if (hubot._isPrivateConversation(message)) {
      return privateHelpMessage(hubot, user);
   }

   return null;
}

function publicHelpMessage(hubot, user) {
   return hubot.speech().hello(user).append('You need help? Call me in private chat.').end();
}

function privateHelpMessage(hubot, user) {
   return hubot.speech().hello(user).append('How can I help?').append(getHelpOptions(hubot)).end();
}

function getHelpOptions(hubot) {
   let speecher = hubot.speech();

   activeGears(hubot).forEach(gear => buildCategories(gear, speecher));

   return speecher.end();
}

function activeGears(hubot) {
   return hubot.gears.filter(g => g.active);
}

function buildCategories(gear, speecher) {
   let visibleCategories = gear.categories.filter(c => c.visible);

   visibleCategories.forEach(function(category) {
      speecher.paragraph().bold(category.name).line().append(category.description).paragraph();
      buildTasks(gear, category, speecher);
   });  
}

function buildTasks(gear, category, speecher) {
   tasks(gear, category).forEach(task => speecher.item().bold(task.trigger).separator().append(task.description).line());
}

function tasks(gear, category) {
   return gear.tasks.filter(t => t.category === category.key);
}
