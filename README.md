# og

A simple way to add passwords to a url

## Video Demo

<iframe src="https://www.youtube-nocookie.com/embed/SY1Ondlh5bA" width="560" height="315" title="og - CS50 Final Project" frameborder="0" allowfullscreen></iframe>

## Description

This explains my thought process while making the app.
It's pretty long since I submitted this as my final project for CS50.
If you just want to deploy the app you can jump to [deploy](#deploy-it-yourself).

### Why the name og?

It’s simple, og is the opposite of go and since of is a way to password protect urls, inverting the word makes sense.

### How to protect the urls

My first choice was whether to use a database or not. I ended up going for no database.
I chose no database since I want og to be easy to host without much cost and having a database would increase costs.
To accomplish that I had to find a way of not using a database and still having the urls protected.
For that I started searching for some way to encrypt the password and the destination on the link.
I found fernet, a symmetric (Meaning I can use the same key to encrypt and decrypt) encryption.
One of the advantages of fernet is that it produces different tokens for the same data, making it more secure.

With that in mind I wanted the links to look like this:

```
https://example.com/[token]
```

### Programming the app

I wanted something that would let me program the server and the client on the same package, making my code more readable and organized.
To accomplish that I chose Svelte along with SvelteKit which provides everything I needed to make the full stack app in one codebase.
I chose Svelte over react for these reasons: Native framework for full stack apps (SvelteKit), I already know some react and wanted to try something new and I really like how Svelte works (The way it’s code is HTML like).

### Styling the pages

Since I didn’t want to have much work styling my web app I tried to find something that would do that for me.
I thought about using bootstrap but while researching CSS frameworks I found [SimpleCSS](https://simplecss.org) which makes things look good out of the box and is more lightweight than Bootstrap.

### Deploying

I really liked how my project idea was turning out, so I wanted to deploy it to the internet.
At first I was gonna deploy it to Cloudflare Workers but they don’t really work well with fernet and crypto js (Which is a library fernet depends on).
So I had to find an alternative and I chose Netlify which had support for crypto js and they also let me add a custom domain like Cloudflare.
As my project was configured to use Workers from the start I just had to change some minor stuff and change the SvelteKit Adapter (But what’s that?)

#### SvelteKit adapters

Like some other frameworks SvelteKit has those things called adapters, and they are really cool, they allow someone to make Svelte deployable anywhere. And in my case I am using the Svelte adapter for Netlify.

### Authentication

Since I want to deploy my project to the internet it needs some sort of restriction on who can create links to prevent spam to my url shortener, so I decided to limit link creation to myself.

To accomplish that I am used [Auth.js](https://authjs.dev/) which makes authentication simple.

### Enviroment Variables

I am making use of enviroment variables to allow for simple customization of og.
With enviroment variables you can customize your private and public short domain, provider, api key, people who log in and disable authentication.

## Deploy it yourself

Deploying og is very simple, you can just click the button below and set the enviroment variables.

You don't need to set public shorteners even if you disable authentication, they become available by default.

Currently the supported providers are:

- [shortio](https://short.io)
- [tinyurl](https://tinyurl.com)

You should follow their instructions on how to get an API key.

To enable authentication the following steps are needed:

- Set `AUTH_ENABLED=true`
- Set `AUTH_DISCORD_ID` to your [discord application id](https://discord.com/developers)
- Set `AUTH_DISCORD_SECRET` to your discord application secret
- `AUTH_SECRET` comes set by default, to keep your instance safe you should change it.
  To generate a secret you can run :

  ```sh
  npm exec auth secret

  # or

  openssl rand -base64 33
  ```

You're all set to deploy! Click the button below and follow the instructions:

<br/>

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/edrf12/og#AUTH_SECRET=5Yqr+8QLuNx820W0WqicTS9DcSDDGJTGyuthWZv0L2A=)
