# Kitabu Gateway

Create a minimal shell for an existing static web app called "Kitabu cha Wageni" (an offline, Swahili-first guestbook assistant for a small coffee-farm tour host). The real app is plain HTML/JavaScript that will be added later as static files under public/kitabu/ through GitHub sync. Do not build the app yourself and do not add any other features.

Please only:
1. Make the home page (/) immediately send the browser to /kitabu/index.html on the client (window.location.replace).
2. While that happens, show a centered fallback: the title "Kitabu cha Wageni", the line "Guestbook assistant for a small coffee-farm host · works offline", and a link to /kitabu/index.html labelled "Fungua · Open". Background #F3F2EC, text and link color #24533F, system font.
3. Set the browser tab title to "Kitabu cha Wageni".

No backend, no database, no authentication, no other pages, no placeholder content.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ad670fff-b5db-4d8d-b40a-9b496a813994).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
