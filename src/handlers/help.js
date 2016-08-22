'use strict';

exports.handle = handle;

function handle(hubot, message) {
   var helpMessage = getHelpMessage(hubot, message);
   
   if (helpMessage) {
      hubot.postMessage(hubot.getRecipient(message), helpMessage, {as_user: true});   
   }
}

function getHelpMessage(hubot, message) {
   var user = hubot._getUserById(message.user);
   
   if (hubot._isChannelConversation(message)) {
      return getPublicHelpMessage(hubot, user);
   } 
   
   if (hubot._isPrivateConversation(message)) {
      return getPrivateHelpMessage(hubot, user);
   }

   return null;
}

function getPublicHelpMessage(hubot, user) {
   return hubot.speech().hello(user).append('You need help? Call me in private chat.').end();
}

function getPrivateHelpMessage(hubot, user) {
   return hubot.speech().hello(user).append('How can I help?').append(getHelpOptions(hubot)).end();
}

function getHelpOptions(hubot) {
   var speecher = hubot.speech();

   getVisibleCategories(hubot).forEach(category => buildCategory(hubot, speecher, category));

   return speecher.end();
}

function getVisibleCategories(hubot) {
   return hubot.core.categories.filter(c => c.visible);
}

function buildCategory(hubot, speecher, category) {
   speecher.paragraph().bold(category.name).line().append(category.description).paragraph();
   
   buildTasks(hubot, speecher, category);
}

function buildTasks(hubot, speecher, category) {
   getTasks(hubot, category).forEach(task => speecher.item().bold(task.trigger).separator().append(task.description).line());
}

function getTasks(hubot, category) {
   return hubot.core.tasks.filter(t => t.category == category.key);
}
