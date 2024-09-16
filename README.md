# Tetris

This is a Tetris game project developed using HTML, CSS, and JavaScript. The goal is to create a classic Tetris experience with some customizations and aesthetic improvements.

## Features

- **Tetris Game**: The classic Tetris game with piece control, rotation, collision detection, and scoring.
- **Score and Level**: Displays the current score and the player's level.
- **Top 10 Scores**: Saves and displays the top 10 high scores automatically.
- **Game Controls**: Buttons to start, pause, and restart the game.
- **Custom Styling**: Responsive design with a background image and enhanced button and score styles.

## Game Instructions

- **Movement**: Use the arrow keys (left/right) to move the piece, down arrow to accelerate the fall, and spacebar to rotate the piece.
- **Start Button**: Starts the game. After restarting, you need to click this button to start playing again.
- **Pause Button**: Pauses the current game.
- **Restart Button**: Clears the board and restarts the game, but the game only starts after pressing the "Start" button again.

## Changes and Improvements

1. **Visual Style**:
   - The game is placed within a semi-transparent black rectangle for better aesthetics.
   - The background of the game has been changed to a custom image.

2. **Control Buttons**:
   - The "Start", "Pause", and "Restart" buttons have been styled to match the score display, with black backgrounds and white text.
   - Buttons are positioned below the game board.

3. **Game Restart**:
   - Clicking the "Restart" button now clears all blocks from the board, and no piece starts falling automatically. The player must press "Start" to begin the game again.

4. **Score Display**:
   - Added a score display next to the game board, showing the current score, level, and the top 10 registered scores.

## Project Structure

- **index.html**: Main HTML structure of the game.
- **styles.css**: (Styles are embedded in the HTML file for simplicity) – Defines the appearance of the game.
- **tetris.js**: JavaScript logic responsible for the Tetris gameplay.
