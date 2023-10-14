import { expect } from "chai";
import splitByRanges from "../src/splitByRanges.js";

describe("splitByRanges()", function () {
  let message;
  let emotes;

  describe("when the message ends with an emote", function () {
    before(function () {
      message = `Ok, <3, this is BabyRage? BOP <3`;
      emotes = {
        456: ["16-23"],
        789: ["26-28"],
        123: ["4-5", "30-31"],
      };
    });

    it("replaces twitch emotes with image tags correctly", function () {
      const newMessage = splitByRanges(message, emotes);
      expect(newMessage).to.eql([
        {
          type: "text",
          content: "Ok, ",
        },
        { type: "emote", content: "123" },
        { type: "text", content: ", this is " },
        { type: "emote", content: "456" },
        { type: "text", content: "? " },
        { type: "emote", content: "789" },
        { type: "text", content: " " },
        { type: "emote", content: "123" },
      ]);
    });
  });

  describe("when the message does not end with an emote", function () {
    before(function () {
      message = `Ok, <3, this is BabyRage? BOP <3 and so on`;
      emotes = {
        456: ["16-23"],
        789: ["26-28"],
        123: ["4-5", "30-31"],
      };
    });

    it("replaces twitch emotes with image tags correctly", function () {
      const newMessage = splitByRanges(message, emotes);
      expect(newMessage).to.eql([
        {
          type: "text",
          content: "Ok, ",
        },
        { type: "emote", content: "123" },
        { type: "text", content: ", this is " },
        { type: "emote", content: "456" },
        { type: "text", content: "? " },
        { type: "emote", content: "789" },
        { type: "text", content: " " },
        { type: "emote", content: "123" },
        { type: "text", content: " and so on" },
      ]);
    });
  });
});
