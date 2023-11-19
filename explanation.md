# Explanation

- The first complex part was checking which tiles should be valid moves, this is done by checking if a tile has a neighbor that is controlled by them. The complexity comes mostly from the tiles along the edge as I decided to store the tiles in a 1D array, thus I had to find all the edge cases and make sure tto handle them to ensure good gameplay.
- The second complex part was adding the powerups, especially the bomb powerup, since I had to ensure that the bomb blast only controls tiles that are neighboring it and that the tiles state are updated in sync since not there are a lot of async functions in react and it also relies on events and updates triggering functions.
- The third complex part was checking the game win state, since I had to ensure that I am accuratly checking if a player ran out of moves to decide the winner.
