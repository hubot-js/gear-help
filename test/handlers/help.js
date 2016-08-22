var help = require('../../src/handlers/help');
var chai = require("chai");
var expect = chai.expect;
var sinon = require('sinon');

describe('Help ', function() {
   var message, hubot, speech, endSpy, boldSpy, lineSpy, itemSpy, helloSpy, appendSpy, separatorSpy, paragraphSpy, postMessageSpy;

   beforeEach(function() {
      message = { "user": "hubot", "channel": "myChannel" };
      
      hubot = getHubot();
      speech = getSpeech();

      initSpies();
   });

   describe('requested in a channel', function() {

      it("post a message saying that assistance should be requested in private", function() {
         isChannelConversation();

         help.handle(hubot, message);

         expect(helloSpy.calledWith(message.user)).to.be.true;
         expect(appendSpy.calledWith('You need help? Call me in private chat.')).to.be.true;
         expect(endSpy.called).to.be.true;

         expect(postMessageSpy.calledWith(message.channel, 'fakeMessage', {as_user: true})).to.be.true;
      });
      
   });   

   describe('requested in privated', function() {

      describe('post a message showing', function() {

         it("only visible categories", function() {
            isPrivateConversation();
            withoutTasks();

            help.handle(hubot, message);

            expect(helloSpy.withArgs(message.user).calledOnce).to.be.true;
            expect(appendSpy.withArgs('How can I help?').calledOnce).to.be.true;

            expect(paragraphSpy.callCount).to.be.equal(4);
            expect(lineSpy.callCount).to.be.equal(2);
            
            expect(boldSpy.calledWith('name1')).to.be.true;
            expect(boldSpy.calledWith('name2')).to.be.true;
            
            expect(appendSpy.calledWith('description1')).to.be.true;
            expect(appendSpy.calledWith('description2')).to.be.true;

            expect(boldSpy.neverCalledWith('category3')).to.be.true;
            expect(appendSpy.neverCalledWith('description3')).to.be.true;

            expect(endSpy.callCount).to.be.equal(2);

            expect(postMessageSpy.calledWith(message.user, 'fakeMessage', {as_user: true})).to.be.true;
         });

         it("and tasks by category", function() {
            isPrivateConversation();

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

            expect(postMessageSpy.calledWith(message.user, 'fakeMessage', {as_user: true})).to.be.true;
         });

      });
   });

   describe('requested in a unknow source', function() {

      it("do nothing", function() {
         isUnknowSource();

         help.handle(hubot, message);

         expect(postMessageSpy.callCount).to.be.equal(0);
      });

   });

   function getHubot() {
      return { 
         _getUserById: function () { return message.user },
         postMessage: function () {},
         speech: function() { return speech },
         core: {
            categories: [
               { "key": "category1", "name": "name1", "description": "description1", "visible": true },
               { "key": "category2", "name": "name2", "description": "description2", "visible": true },
               { "key": "category3", "name": "name3", "description": "description3", "visible": false }
            ],
            tasks: [
               { "category": "category1", "trigger": "trigger1", "description": "taskDescription1" },
               { "category": "category1", "trigger": "trigger2", "description": "taskDescription2" },
               { "category": "category2", "trigger": "trigger3", "description": "taskDescription3"  },
               { "category": "category2", "trigger": "trigger4", "description": "taskDescription4"  },
            ]
         }
      };
   }

   function getSpeech() {
      return {
         end: function() { return 'fakeMessage' },
         bold: function() { return this },
         line: function() { return this },
         item: function() { return this },
         hello: function() { return this },
         append: function() { return this },
         separator: function() { return this },
         paragraph: function() { return this }
      }
   }

   function initSpies() {
      endSpy = sinon.spy(speech, "end");
      boldSpy = sinon.spy(speech, "bold");
      lineSpy = sinon.spy(speech, "line");
      itemSpy = sinon.spy(speech, "item");
      helloSpy = sinon.spy(speech, "hello");
      appendSpy = sinon.spy(speech, "append");
      separatorSpy = sinon.spy(speech, "separator");
      paragraphSpy = sinon.spy(speech, "paragraph");
      
      postMessageSpy = sinon.spy(hubot, "postMessage");
   }

   function isChannelConversation() {
      hubot._isChannelConversation = function () { return true };
      hubot._isPrivateConversation = function () { return false };
      hubot.getRecipient = function() { return message.channel };
   }

   function isPrivateConversation() {
      hubot._isChannelConversation = function () { return false };
      hubot._isPrivateConversation = function () { return true };
      hubot.getRecipient = function() { return message.user };   
   }

   function isUnknowSource() {
      hubot._isChannelConversation = function () { return false };
      hubot._isPrivateConversation = function () { return false };
      hubot.getRecipient = function() { return message.user };   
   }

   function withoutTasks() {
      hubot.core.tasks = [];
   }

}); 
