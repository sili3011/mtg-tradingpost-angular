# ⚖️ mtg-tradingpost: the future of how you will handle and digitize your (MTG) card collection!

I want to create a webapp to keep track of all my MTG Cards that also tells me how much they are worht and which i miss. For example: I want to build another green commander deck, do I own enough Cultivates for all of them? If not, are there decks that I own that I dont play anymore and have the card in it? Are all my cards legal for the chosen format in this deck? There might be apps that do that already. But what i really dislike, is searching for each card manually. So i built a card detector that automatically detects my cards with the webcam. I also dont want anyone to give me their data if they dont want to, so offline usage is also planned.

## How to use:

> :warning: **The app is in an unreleased pre-alpha state! There will be bugs and errors!**

- [Go here!](https://mtg-tradingpost.com)
- Create a database (insert a name into **owner** and a name into **name**)
- Optional: Dont forget to make a backup of your data once you leave!

## Features:

### Implemented:

- Digitize my collection
- Setup a wishlist
- Construct decks:
  - Decks will be validated (FE: are all cards legal?)
  - Decks check if you own all/enough of each card
- A card detector via webcam (highly experimental)

### Planned:

- Fully working offline
- User log in (if you dont want to handle your database on your own)
- Finance overview
- Finding cheapest offers for my wanted cards
- Sharing deck templates
- Customization on filtering cards
- Collectors view (which cards am I missing?)
- Card suggestions for decks
- Support other tcg card games
- ... many more

> ! Note to myself:
> ! `run browserify index.js --standalone blockhashjs > blockhash.js in node_modules/blockhash`
