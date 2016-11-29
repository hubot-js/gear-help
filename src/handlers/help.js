'use strict';

exports.handle = handle;

function handle(hubot, message) {
  const user = hubot.getUser(message);
  const helpMessage = hubot.speech().hello(user).append('How can I help?').append(getHelpOptions(hubot)).end();

  hubot.speak(message, helpMessage);
}

function getHelpOptions(hubot) {
  const speecher = hubot.speech();

  activeGears(hubot).forEach(gear => buildCategories(gear, speecher));

  return speecher.end();
}

function activeGears(hubot) {
  return hubot.gears.filter(g => g.active);
}

function buildCategories(gear, speecher) {
  const visibleCategories = gear.categories.filter(c => c.visible);

  visibleCategories.forEach((category) => {
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
