# Twitch Chat Overlay Base

A base for customizable Twitch chat overlays. The base design is (_drumroll_) very basic and consists of a dark transparent rounded box to the left of the screen. The username and pronouns (if provided) are displayed with the user's chat color as background. Standard Twitch emotes, BTTV and FFZ emotes are supported. There is also a chat strip mode where the chat is displayed on in a horizontal strip at the bottom of the screen.

## Getting Started

The easiest way to get started is via [Glitch](https://glitch.com).
If you don't mind dealing with running a web server, check out the [Advanced Setups](#advanced-setups) section to learn more.

### Remix on Glitch

If you already have a Glitch account you can just remix the project.

1. Go to [glitch.com](https://glitch.com) and log in with your account.
2. Visit the [Twitch Chat Overlay Base project](https://glitch.com/edit/#!/twitch-chat-overlay) on Glitch.
3. Hit the _Remix_ button to remix (=duplicate) the project for yourself.
4. Once the project is ready, you can click the _Share_ button and copy the URL you can find under _Live site_
5. Take this new live URL (it should have a random 3-word string in it) and use it in your streaming software (OBS etc.) as the URL for a browser source.
6. Make sure you follow the instructions under [Integration into OBS](#integration-into-obs) below on how to use that URL.

### Where do I start with changes to the code?

**Be aware** that anything inside the `build` folder is automatically generated code that shouldn't be edited.

- `style.css`: If you want to make some design changes the top level `style.css` file is the right place.
- `src/main.js`: If you want to make changes, for example to the order or structure of the HTML, check out `src/main.js`, and particulary the `createMessageHTMLElement()` function.

## Integration into OBS

This guide describes OBS, but it should work almost identical in other streaming software.

Take the URL under which the overlay is running. In case you remixed on Glitch, the URL should be something similar to `https://rando-url-soup.glitch.me`. Here's how you integrate it into OBS.

Add a browser source and as the URL you input:

```
https://rando-url-soup.glitch.me?channel=XYZ
```

Substitute `XYZ` with the name of your channel.

If you want the chat strip mode.

```
https://rando-url-soup.glitch.me?channel=XYZ&chatStrip
```

Make sure you adjust the values for width and height to:

```
width: 1920
height: 1080
```

## Advanced Setups

### Running Local Development Server

1. Fetch the codebase with git.
2. Within the codebase folder run `npm install` to install all necessary dev packages.
3. With `npm start` you open up a dev server under `http://localhost:3000`.
4. Make sure you follow the instructions under [Integration into OBS](#integration-into-obs) on how to use that URL.

### Running On a Web Server

#### Downloading Pre-built Code

You can download the pre-built code from the GitHub repository directly. The `build` folder should contain all the files that need to be served from a web server.

Go to _Releases_ and pick the latest version and download the source code under _Assets_. Take the source code from the `build` folder and serve it from a server.

Make sure you follow the instructions under [Integration into OBS](#integration-into-obs) on how to use that URL.

#### Building the Code Yourself

1. Fetch the codebase with git.
2. Within the codebase folder run `npm install` to install all necessary dev packages.
3. With `npm run build` the code is built into the `build` folder, which can then be served by any web server or service that serves static files.
4. Make sure you follow the instructions under [Integration into OBS](#integration-into-obs) on how to use that URL.
