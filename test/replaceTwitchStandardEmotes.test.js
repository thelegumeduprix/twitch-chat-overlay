import { expect } from "chai";
import {
  replaceTwitchStandardEmotes,
  TWITCH_URL_PREFIX,
} from "../src/emotes.js";

describe("replaceTwitchStandardEmotes()", function () {
  let message;
  let emotes;

  describe("when emotes object contains emote ranges and text ends with an emote", function () {
    before(function () {
      message = `Ok, LUL, this is BabyRage? BOP`;
      emotes = {
        456: ["17-24"],
        789: ["27-29"],
        123: ["4-6"],
      };
    });

    it("replaces twitch emotes with image tags correctly", function () {
      const newMessage = replaceTwitchStandardEmotes(message, emotes);
      expect(newMessage).to.equal(
        `Ok, <img src="${TWITCH_URL_PREFIX}/123/default/light/3.0" alt="emote" class="emote" />, this is <img src="${TWITCH_URL_PREFIX}/456/default/light/3.0" alt="emote" class="emote" />? <img src="${TWITCH_URL_PREFIX}/789/default/light/3.0" alt="emote" class="emote" />`
      );
    });
  });

  describe("when emotes object contains emote ranges and text ends with non-emote", function () {
    before(function () {
      message = `Ok, LUL, this is BabyRage? BOP and so on`;
      emotes = {
        456: ["17-24"],
        789: ["27-29"],
        123: ["4-6"],
      };
    });

    it("replaces twitch emotes with image tags correctly", function () {
      const newMessage = replaceTwitchStandardEmotes(message, emotes);
      expect(newMessage).to.equal(
        `Ok, <img src="${TWITCH_URL_PREFIX}/123/default/light/3.0" alt="emote" class="emote" />, this is <img src="${TWITCH_URL_PREFIX}/456/default/light/3.0" alt="emote" class="emote" />? <img src="${TWITCH_URL_PREFIX}/789/default/light/3.0" alt="emote" class="emote" /> and so on`
      );
    });
  });

  describe("when emotes object contains emotes with HTML characters and there are text parts that contain other HTML", function () {
    before(function () {
      message = `Ok <p>something</p>, <3, and more HTML: <img src="evilURL" />`;
      emotes = {
        123: ["21-22"],
      };
    });

    it("escapes any HTML without breaking emotes with HTML characters in them", function () {
      const newMessage = replaceTwitchStandardEmotes(message, emotes);
      expect(newMessage).to.equal(
        `Ok &lt;p&gt;something&lt;/p&gt;, <img src="${TWITCH_URL_PREFIX}/123/default/light/3.0" alt="emote" class="emote" />, and more HTML: &lt;img src=&quot;evilURL&quot; /&gt;`
      );
    });
  });

  describe("when emotes object contains several occurences for the same emote", function () {
    before(function () {
      message = `LUL LUL WUT LUL`;
      emotes = {
        456: ["0-2", "4-6", "12-14"],
        789: ["8-10"],
      };
    });

    it("replaces twitch emotes with image tags correctly", function () {
      const newMessage = replaceTwitchStandardEmotes(message, emotes);
      expect(newMessage).to.equal(
        `<img src="${TWITCH_URL_PREFIX}/456/default/light/3.0" alt="emote" class="emote" /> <img src="${TWITCH_URL_PREFIX}/456/default/light/3.0" alt="emote" class="emote" /> <img src="${TWITCH_URL_PREFIX}/789/default/light/3.0" alt="emote" class="emote" /> <img src="${TWITCH_URL_PREFIX}/456/default/light/3.0" alt="emote" class="emote" />`
      );
    });
  });

  describe("when emotes object contains emote ranges and there are multi-codepoint emojis in the messge", function () {
    before(function () {
      message = `🤦🏾‍♀️ LUL`;
      emotes = {
        456: ["6-8"],
      };
    });

    it("replaces twitch emotes with image tags correctly", function () {
      const newMessage = replaceTwitchStandardEmotes(message, emotes);
      expect(newMessage).to.equal(
        `🤦🏾‍♀️ <img src="${TWITCH_URL_PREFIX}/456/default/light/3.0" alt="emote" class="emote" />`
      );
    });
  });

  describe("when emotes object contains emote ranges and there are multi-codepoint emojis and special character based emotes in the messge", function () {
    before(function () {
      message = "🤦🏾‍♀️ LUL 👩‍👩‍👧 :O and test";
      emotes = {
        425618: ["6-8"],
        555555580: ["16-17"],
      };
    });

    it("replaces twitch emotes with image tags correctly", function () {
      const newMessage = replaceTwitchStandardEmotes(message, emotes);
      expect(newMessage).to.equal(
        `🤦🏾‍♀️ <img src="${TWITCH_URL_PREFIX}/425618/default/light/3.0" alt="emote" class="emote" /> 👩‍👩‍👧 <img src="${TWITCH_URL_PREFIX}/555555580/default/light/3.0" alt="emote" class="emote" /> and test`
      );
    });
  });

  describe("when emotes object is empty", function () {
    before(function () {
      message = `Ok, LUL, this is BabyRage? BOP`;
      emotes = {};
    });

    it("leaves the message as-is", function () {
      const newMessage = replaceTwitchStandardEmotes(message, emotes);
      expect(newMessage).to.equal(message);
    });
  });

  describe("when emotes object is not provided", function () {
    before(function () {
      message = `Ok, LUL, <p>this</p> is BabyRage? BOP`;
      emotes = undefined;
    });

    it("leaves the message as-is, except that it still escapes any existing HTML", function () {
      const newMessage = replaceTwitchStandardEmotes(message, emotes);
      expect(newMessage).to.equal(
        `Ok, LUL, &lt;p&gt;this&lt;/p&gt; is BabyRage? BOP`
      );
    });
  });
});
