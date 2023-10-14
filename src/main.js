import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";
import tmi from "tmi.js";
import twemoji from "twemoji";
import processMessage from "./processMessage.js";
import { fetchPronounsForUser } from "./pronouns.js";

extend([a11yPlugin]);

const MAX_MESSAGES_COUNT = 20;
const SHOW_BADGES = false;
const SHOW_PRONOUNS = true;
const REMOVE_MESSAGES_AFTER_TIMER = false;
const MESSAGE_REMOVAL_TIMER_THRESHOLD = 5000; // unit is in ms

const BADGE_IMAGE_URLS = {
  staff:
    "https://static-cdn.jtvnw.net/badges/v1/d97c37bd-a6f5-4c38-8f57-4e4bef88af34/2",
  admin:
    "https://static-cdn.jtvnw.net/badges/v1/9ef7e029-4cdf-4d4d-a0d5-e2b3fb2583fe/2",
  broadcaster:
    "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/2",
  moderator:
    "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2",
  verified:
    "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/2",
  vip: "https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/2",
  "artist-badge":
    "https://static-cdn.jtvnw.net/badges/v1/4300a897-03dc-4e83-8c0e-c332fee7057f/2",
  no_audio:
    "https://static-cdn.jtvnw.net/badges/v1/aef2cd08-f29b-45a1-8c12-d44d7fd5e6f0/2",
  no_video:
    "https://static-cdn.jtvnw.net/badges/v1/199a0dba-58f3-494e-a7fc-1fa0a1001fb8/2",
};

let chatContainerSelectorName;

async function createMessageHTMLElement(tags, message) {
  const messageData = await processMessage(tags, message);

  const { messageHTML, displayName } = messageData;

  let { userColor } = messageData;
  // if user color is not set, use another default
  userColor = colord(userColor || "#b9a3e3").toHex();

  const contrastWithBlack = colord(userColor).contrast("#000");
  const contrastWithWhite = colord(userColor).contrast("#fff");

  const textShouldBeBlack = contrastWithBlack > contrastWithWhite;

  const messageInItalics = messageData.isSlashMeMessage;

  const style = `background-color: ${userColor}; color: ${
    textShouldBeBlack ? "#000" : "#fff"
  };`;

  let badgesHTML = "";
  if (SHOW_BADGES) {
    messageData.badgeKeys.forEach((badgeKey) => {
      const badgeImageUrl = BADGE_IMAGE_URLS[badgeKey];
      if (badgeImageUrl) {
        badgesHTML += `<img src=${badgeImageUrl} class="user-badge">`;
      }
    });
  }

  let userNameHTML = `
    <span class="username" style="${style}">
      ${badgesHTML}
      ${displayName}
      ${
        SHOW_PRONOUNS && !messageInItalics
          ? "<span class='pronouns'></span>"
          : ""
      }    
    </span>  
  `;

  const messageElement = document.createElement("p");
  messageElement.className = "message";

  if (messageInItalics) {
    messageElement.classList.add("italic");
  }

  messageElement.id = tags.id;
  messageElement.setAttribute("data-user-id", tags["user-id"]);
  messageElement.innerHTML = `${userNameHTML} <span class="message-text">${messageHTML}</span>`;

  twemoji.parse(messageElement);

  return messageElement;
}

async function addMessage(channel, tags, message) {
  const messageElement = await createMessageHTMLElement(tags, message);

  const chatBoxElement = document.querySelector(chatContainerSelectorName);
  chatBoxElement.append(messageElement);

  if (SHOW_PRONOUNS) {
    fetchPronounsForUser(tags.username).then((pronounsText) => {
      if (pronounsText) {
        addPronounsToUsername(tags["user-id"], pronounsText);
      }
    });
  }

  const allMessageElements = document.querySelectorAll(
    `${chatContainerSelectorName} p`
  );

  if (allMessageElements.length > MAX_MESSAGES_COUNT) {
    // remove the first message from the beginning of the list
    allMessageElements[0]?.remove();
  }

  if (REMOVE_MESSAGES_AFTER_TIMER) {
    startMessageRemovalTimer(tags.id);
  }
}

function addPronounsToUsername(userId, pronounsText) {
  const pronounsElements = document.querySelectorAll(
    `[data-user-id="${userId}"] .username .pronouns`
  );
  pronounsElements.forEach(
    (element) => (element.innerHTML = `&nbsp;(${pronounsText})`)
  );
}

function startMessageRemovalTimer(messageId) {
  setTimeout(() => {
    const toBeDeletedMessageElement = document.getElementById(messageId);
    toBeDeletedMessageElement?.remove();
  }, MESSAGE_REMOVAL_TIMER_THRESHOLD);
}

function removeMessage(channel, username, deletedMessage, userstate) {
  const messageId = userstate["target-msg-id"];
  const toBeDeletedMessageElement = document.getElementById(messageId);
  toBeDeletedMessageElement?.remove();
}

function removeAllMessagesOfUser(
  channel,
  username,
  reason,
  duration,
  userstate
) {
  const userId = userstate["target-user-id"];
  const toBeDeletedMessageElements = document.querySelectorAll(
    `[data-user-id="${userId}"]`
  );
  toBeDeletedMessageElements.forEach((element) => element.remove());
}

function setup() {
  const queryParameters = new URLSearchParams(window.location.search);
  const CHANNEL_NAME = queryParameters.get("channel");
  const CHAT_STRIP_MODE = queryParameters.has("chatStrip");

  if (CHAT_STRIP_MODE) {
    document.querySelector(".chat-box").style.display = "none";
    chatContainerSelectorName = ".chat-strip";
  } else {
    document.querySelector(".chat-strip").style.display = "none";
    chatContainerSelectorName = ".chat-box";
  }

  const client = tmi.Client({
    channels: [CHANNEL_NAME],
  });

  client.connect();
  client.on("message", addMessage);
  client.on("messagedeleted", removeMessage);
  client.on("timeout", removeAllMessagesOfUser);
  client.on("ban", removeAllMessagesOfUser);
}

document.addEventListener("DOMContentLoaded", setup);
