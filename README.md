# ReThink
Video Demo: https://youtu.be/K26z_sumeBY
## Description:
This project, ReThink, was conceived out of a desire to aid my 9-year-old son who encountered difficulties mastering the multiplication table. Recognizing his enthusiasm for games and friendly competition, I crafted this educational site to transform learning into an engaging and enjoyable experience.

ReThink is built on a foundation of technology that includes a SQLite database for data management, Flask as a lightweight web framework for routing and server-side logic, Python for backend functionality, and a combination of HTML, CSS, and JavaScript to bring the website and games to life.

**app.py** - This is the heart of ReThink, a Python application utilizing Flask to manage server-side operations. It routes user requests to the appropriate HTML templates, interacts with the SQLite database for data retrieval and storage, and ensures that the server-side logic runs seamlessly.

**helpers.py** - A Python script containing auxiliary functions that support app.py. There are a couple functions about login and error handling

**static/:**

**logo.png** - The logo image that represents ReThink, used across the site for branding purposes and as a link to the home page.
**multiply.js** - JavaScript file containing the logic for multiplication challeng game. It generates random examples of multiplication and track for score and user interaction.
**styles.css** - The cascading style sheet file that dictates the visual appearance of ReThink, ensuring a consistent and responsive user interface.
**tiles.js**- JavaScript file, for a tiles game. It also generates a field full of tiles, randomises and rememebers they positions and track for scores and user interractions 

**templates/:**

**layout.html** - The base HTML template that provides a consistent layout for the other templates to inherit. It includes the basic structure, navigation, and any shared components.

**index.html, login.html, register.html, changepass.html, multiply.html, tiles.html, error.html** - These HTML files serve as templates for the respective pages of ReThink, each designed for specific functionalities like user authentication, game interfaces, and error handling.

**README.md** - The file you are currently reading, designed to guide users and developers through the structure and purpose of ReThink.

Throughout the development process, I made several key decisions.  
- first one was about game logic for multiplication challenge. It was not quite obvious how to amke people close to fail. So the random answer numbers are not quite random they are tend to be an essence of all mistakes made by me and my son.
- Flask was selected for its straightforward and unobtrusive approach to web development, allowing for quick deployment and development.
- JS I decided to use to learn it better 

In conclusion, ReThink is designed to make learning fun and interactive. I invite you to explore ReThink and discover the joy of learning through play.

