import replaceEmotesWithImageTags from "./emotes.js";

const processMessage = async (tags, message) => {
  const messageHTMLWithEmotesReplaced = await replaceEmotesWithImageTags(
    message,
    tags.emotes
  );

  return {
    messageHTML: messageHTMLWithEmotesReplaced,
    displayName: tags["display-name"],
    userColor: tags.color,
    isSlashMeMessage: tags["message-type"] === "action",
    badgeKeys: tags.badges ? Object.keys(tags.badges) : [],
  };
};

export default processMessage;
