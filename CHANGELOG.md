# Changelog

## 2024-4-2

I began by setting up the structure of the project. I wanted to have a working development and production environment before starting the actual work. I also wanted to have a good understanding of the project structure and the tools I would be using. By the end of the day I had a working Hello world app.

![v1](https://github.com/mtdvlpr/API-2324/assets/46671786/3d860374-9a64-4254-9fb8-1b507cc2663f)

## 2024-4-4

I added some components to the project and tried to render them from the base layout. I also added some basic styles to the project.

![v1 5](https://github.com/mtdvlpr/API-2324/assets/46671786/2f387464-7a0b-4dc8-941c-2fd4eeb98f7b)

## 2024-4-5

I started thinking of the features I wanted to implement in the project. I decided to use the TMDB API to fetch movie data. I also thought about the Web APIs I could use in the project. I came up with a list of ideas that I wanted to implement in the project:

- Service Worker API for PWA support
- Web Push API and Badging API for notifications
- Server Sent Events for a chatroom
- Web Share API for sharing movies/series
- Picture-in-Picture API for video player
- Web Speech API for voice search

I shared these ideas with Cyd during the feedback session. She agreed with the ideas and suggested that I should start with the Service Worker API and thought the Web Push API wouldn't fit well with the TMDB API. So I decided to bench the Web Push API for now.

## 2024-4-8

I created the index page with a grid of popular movie cards. I also implemented the Share API to share a movie. I decided to use a Web Component library for the project, so that I could focus on the Web APIs. I chose Shoelace for the project.

![v2](https://github.com/mtdvlpr/API-2324/assets/46671786/ae4c7f27-33bd-4015-aa37-574be233d4d9)

## 2024-4-9

I started working on making the application an actual PWA. I generated some logo assets and added a manifest file to the project. I also added a service worker to the project.

I also created a search and detail page for the movies. I implemented the Web Speech API for voice search.

I added some meta tags to the project for better SEO and created an opensearch.xml file to allow users to add the application as a search engine to their browser.

![v3-home](https://github.com/mtdvlpr/API-2324/assets/46671786/534ad6a9-0e03-4123-aa1a-8985d3e3a9c9)
![v3-detail](https://github.com/mtdvlpr/API-2324/assets/46671786/0c9359af-38c2-4c5f-a551-dc539cba0245)
![v3-search](https://github.com/mtdvlpr/API-2324/assets/46671786/b087ec57-f822-433d-9cec-a25d6dcdb557)

## 2024-4-10

I cleaned up the code, added Type definitions for the TMDB API, and moved the video code to a separate component. I also fixed the movie rating, by mapping the movies to a 5-star rating system.

## 2024-4-11

I started on a global chat using Server Sent Events.

## 2024-4-12

I had a feedback session with Declan. He explained how to correctly implement `srcset` and `sizes` for images.

I cleanup up the chat code and fixed the styling. I also fixed the `srcset` and `sizes` attributes for the images.

![chat-v1](https://github.com/mtdvlpr/API-2324/assets/46671786/d4a4d3ac-e136-4e5b-8185-2e606cd6fa99)

## 2024-4-15

I started with the Push and Badging API. I added a button to enable push notifications. I now show the number of unread messages next to the chat button, set the app badge to the number of unread messages if available and send a notification when the application is open, but not in focus.

I also cleaned up the chat and notification code.

## 2024-4-16

I improved the notification feature, by sending actual Push Notifications through the service worker when the application is closed. I also added toast notifications when the application is open and for error messages.

## 2024-4-17

I implemented the Document Picture-in-Picture API for the chat. You can now pop out the chat into a separate floating window. The only issue is that the styling of my web components are not moved over. I tracked it down to the external script for the web components that isn't executed again in the PiP window.

![pip](https://github.com/mtdvlpr/API-2324/assets/46671786/1da7002f-a554-4e38-b09f-5c8daaa7d56a)

## 2024-4-19

I had a feedback session with Cyd. She was impressed with the progress I had made. I added a fallback image when movies don't have a poster.

## 2024-4-22

I fixed the styling of the Document Picture-in-Picture chat. I added a Trending movies section to the home page with a switch to toggle between trending movies today and this week. I added JavaScript logic to intercept the form submission in order to load the new list without refreshing the page. I implemented the View Transition API to animate the list change. I added the same logic to the search page.

![Screenshot 2024-04-23 091655](https://github.com/mtdvlpr/API-2324/assets/46671786/e4d6ae53-6c44-4e16-bb15-ab532db40110)
![Screenshot 2024-04-23 091754](https://github.com/mtdvlpr/API-2324/assets/46671786/3a84923d-6939-43a8-96b9-155db1883be3)

## Reflection

I learned a lot during this project. I never made a server-side rendered application before, so I had to learn how to render the application from Node.js. I also learned how to use Web APIs like Server Sent Events, Web Share API, Picture-in-Picture API, and Web Speech API. I really enjoyed working with these APIs and I'm looking forward to using them in future projects.

## Features

I have created the following functionality:

- A homepage with a grid of popular movies and a trending movies section that can be toggled between today and this week
- A search page to search for movies
- A detail page for each movie with a trailer
- A global chatroom
- Toast notifications for unread chat messages and errors

I have used the following Web APIs:

- Service Worker API for PWA support and Push Notifications
- Web Share API for sharing movies
- Document Picture-in-Picture API for the chatroom
- Web Speech API for voice search
- Server Sent Events for the chatroom
- View Transition API for animating the trending and search list change
- History API for intercepting the form submission of trending toggle and search and loading the new list without refreshing the page
- Notification API, Badging API, and Push API for notifications of unread chat messages
