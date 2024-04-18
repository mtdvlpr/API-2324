# Changelog

## 2024-4-2

I began by setting up the structure of the project. I wanted to have a working development and production environment before starting the actual work. I also wanted to have a good understanding of the project structure and the tools I would be using. By the end of the day I had a working Hello world app.

## 2024-4-4

I added some components to the project and tried to render them from the base layout. I also added some basic styles to the project.

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

## 2024-4-9

I started working on making the application an actual PWA. I generated some logo assets and added a manifest file to the project. I also added a service worker to the project.

I also created a search and detail page for the movies. I implemented the Web Speech API for voice search.

I added some meta tags to the project for better SEO and created an opensearch.xml file to allow users to add the application as a search engine to their browser.

## 2024-4-10

I cleaned up the code, added Type definitions for the TMDB API, and moved the video code to a separate component. I also fixed the movie rating, by mapping the movies to a 5-star rating system.

## 2024-4-11

I started on a global chat using Server Sent Events.

## 2024-4-12

I had a feedback session with Declan. He was impressed with the progress I had made. He explained how to correctly implement `srcset` and `sizes` for images.

I cleanup up the chat code and fixed the styling. I also fixed the `srcset` and `sizes` attributes for the images.

## 2024-4-15

I started with the Push and Badging API. I added a button to enable push notifications. I now show the number of unread messages next to the chat button, set the app badge to the number of unread messages if available and send a notification when the application is open, but not in focus.

I also cleaned up the chat and notification code.

## 2024-4-16

I improved the notification feature, by sending actual Push Notifications through the service worker when the application is closed. I also added toast notifications when the application is open and for error messages.

## 2024-4-17

I implemented the Document Picture-in-Picture API for the chat. You can now pop out the chat into a separate floating window.
