# vermintide-reddit-css

Please compile SCSS to compressed css to use on reddit.

There are multiple ways to compile SCSS to CSS, [here are some preprocessors](https://graygrids.com/best-tools-resources-compile-manage-sass-less-stylus-css-preprocessors/) in addition to the various web based solutions.

The project includes **`package.json`** and **`gulpfile.js`** to use nodeJS for converting SCSS and for compressing/minifying CSS and images. This encludes **`watchers`/`tasks`** that run in the background (all via console/terminal). 

#### Installation:

1. Install [nodeJS](https://nodejs.org/en/download/).
2. Open a console window in the project root or navigate to the project root.
3. Execute **`npm install gulp-cli -g`** to globally install the gulp-CLI.
4. Execute **`npm install`** to download and install the node modules specified in **`package.json`**.

#### Usage:

Execute the commands **`gulp`** or **`npm start`** in the console (working directory must be the project root).  

**`Start`** is a script defined in **`package.json`** which automatically runs the **`prestart`** script, which runs **`npm install`** and after that **`gulp`** is executed. Simply using the gulp command runs the watchers while using start makes sure that all modules are installed and updated.

##### Using Gulp:
  
After gulp was started there are tasks that watch file changes to all images (`./img/exported/` folder) and all SCSS files (`./scss/`). These tasks are defined in **`gulpfile.js`**.   
When gulp is initialized it runs these tasks once for all files, after that only git-modified files are handled by the watchers.

- SCSS files are converted to CSS and a minified CSS file in the folder `./css`, this folder gets ignored by git since we don't have to push it.
- Images are being compressed and saved to `./img/exported-minified`.

##### Using specific tasks:

While simply using the command **`gulp`** or **`npm start`** handles all basic needs while developing we may want to use specific gulp tasks. To do this either stop the currently running gulp process or use a different console window and use these tasks like this:   

```
gulp styles:all
gulp styles:gitmodified
gulp default
```

