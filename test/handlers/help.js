/* eslint-disable no-unused-expressions */

'use strict';

const chai = require('chai');
const sinon = require('sinon');

const help = require('../../src/handlers/help');

const expect = chai.expect;

describe('Help post a message showing', () => {
  let message;
  let hubot;
  let speech;
  let endSpy;
  let boldSpy;
  let lineSpy;
  let itemSpy;
  let helloSpy;
  let appendSpy;
  let separatorSpy;
  let paragraphSpy;
  let speakSpy;

  beforeEach(() => {
    message = { user: 'hubot', channel: 'myChannel' };

    hubot = getHubot();
    speech = getSpeech();

    initSpies();
  });

  it('only categories of active gears', () => {
    withoutTasks();

    help.handle(hubot, message);

    expect(boldSpy.calledWith('name1')).to.be.true;
    expect(boldSpy.neverCalledWith('category4')).to.be.true;
  });

  it('only visible categories', () => {
    withoutTasks();

    help.handle(hubot, message);

    expect(helloSpy.withArgs(message.user).calledOnce).to.be.true;
    expect(appendSpy.withArgs('gear-help:help').calledOnce).to.be.true;

    expect(paragraphSpy.callCount).to.be.equal(4);
    expect(lineSpy.callCount).to.be.equal(2);

    expect(boldSpy.calledWith('name1')).to.be.true;
    expect(boldSpy.calledWith('name2')).to.be.true;

    expect(appendSpy.calledWith('description1')).to.be.true;
    expect(appendSpy.calledWith('description2')).to.be.true;

    expect(boldSpy.neverCalledWith('name3')).to.be.true;
    expect(appendSpy.neverCalledWith('description3')).to.be.true;

    expect(endSpy.callCount).to.be.equal(2);

    expect(speakSpy.calledWith(message, 'fakeMessage')).to.be.true;
  });

  it('tasks by category', () => {
    help.handle(hubot, message);

    expect(itemSpy.callCount).to.be.equal(4);
    expect(separatorSpy.callCount).to.be.equal(4);
    expect(lineSpy.callCount).to.be.equal(6);

    expect(boldSpy.calledWith('trigger1')).to.be.true;
    expect(boldSpy.calledWith('trigger2')).to.be.true;
    expect(boldSpy.calledWith('trigger3')).to.be.true;
    expect(boldSpy.calledWith('trigger4')).to.be.true;

    expect(appendSpy.calledWith('taskDescription1')).to.be.true;
    expect(appendSpy.calledWith('taskDescription2')).to.be.true;
    expect(appendSpy.calledWith('taskDescription3')).to.be.true;
    expect(appendSpy.calledWith('taskDescription4')).to.be.true;

    expect(speakSpy.calledWith(message, 'fakeMessage')).to.be.true;
  });

  function getHubot() {
    return {
      getUser () { return message.user; },
      speak () {},
      speech() { return speech; },
      gears: [
        {
          categories: [
                  { key: 'category1', name: 'name1', description: 'description1', visible: true },
                  { key: 'category2', name: 'name2', description: 'description2', visible: true },
                  { key: 'category3', name: 'name3', description: 'description3', visible: false }
          ],
          tasks: [
                  { category: 'category1', trigger: 'trigger1', description: 'taskDescription1' },
                  { category: 'category1', trigger: 'trigger2', description: 'taskDescription2' },
                  { category: 'category2', trigger: 'trigger3', description: 'taskDescription3' },
                  { category: 'category2', trigger: 'trigger4', description: 'taskDescription4' }
          ],
          active: true
        },
        {
          categories: [
                  { key: 'category4', name: 'name4', description: 'description4', visible: true }
          ],
          active: false
        }
      ]
    };
  }

  function getSpeech() {
    return {
      end() { return 'fakeMessage'; },
      bold() { return this; },
      line() { return this; },
      item() { return this; },
      hello() { return this; },
      append() { return this; },
      separator() { return this; },
      paragraph() { return this; }
    };
  }

  function initSpies() {
    endSpy = sinon.spy(speech, 'end');
    boldSpy = sinon.spy(speech, 'bold');
    lineSpy = sinon.spy(speech, 'line');
    itemSpy = sinon.spy(speech, 'item');
    helloSpy = sinon.spy(speech, 'hello');
    appendSpy = sinon.spy(speech, 'append');
    separatorSpy = sinon.spy(speech, 'separator');
    paragraphSpy = sinon.spy(speech, 'paragraph');

    speakSpy = sinon.spy(hubot, 'speak');
  }

  function withoutTasks() {
    hubot.gears[0].tasks = [];
  }
});
