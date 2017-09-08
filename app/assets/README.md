## The Front End for the Timur Data Browser

  We don't use the Rails asset pipeline since it is easier to manage the client side resources ourselves.

## Dependencies, unfortunately we have dependencies.

### These items should be installed globablly as command line utilties.
  * nodejs
  * npm
    * babel - this will convert our ES6 code to ES5, but in the future we can omit this. This will also convert our jsx code into js. So we do not need a jsx util.
    * webpack - this will minify and condense our JS code
    * jest - javascript unit testing

  ```
  $ sudo apt-get install nodejs;
  $ sudo apt-get install npm;
  $ sudo npm install -g babel-cli;
  $ sudo npm install -g webpack;
  $ sudo npm install -g jest;
  ```

### Symlinking Node
  
  Sometimes the package manager for the system will have 'nodejs' rather than 'node' installed. In this case you want to symlink 'nodejs' to 'node' so babel and webpack can use it properly.

  `$ sudo ln -s `which nodejs` /usr/bin/node`
 
### These items should be installed within the project folder.

  ```
  $ npm install --save react;
  $ npm install --save react-dom;
  $ npm install --save redux;
  $ npm install --save react-redux;
  $ npm install --save redux-thunk;
  $ npm install --save babel-preset-es2015;
  $ npm install --save babel-preset-react;
  $ npm install --save babel-plugin-transform-object-rest-spread;
  ```

  Other depencencies...
  ```
  $ npm install --save d3;
  $ npm install --save downloadjs;
  $ npm install --save lodash.debounce;
  $ npm install --save promise-polyfill;
  $ npm install --save react-move;
  $ npm install --save redux-logger;
  $ npm install --save reselect;
  $ npm install --save vector;
  $ npm install --save webworkify;
  $ npm install --save child_process;
  $ npm install --save fs;
  $ npm install --save marked;
  $ npm install --save json2csv;
  $ npm install --save node-uuid;
  $ npm install --save prismjs;
  $ npm install --save d3-force;
  ``

  OR you can just run...

  `$ npm install`

  npm will read the 'package.json' file and install the appropriate dependencies.

## Active Development.

  There are two utilities that you will need to run while you are developing.

  * babel
  * webpack

  I like running two terminals (using tmux) side by side and running each util in a separate pane so I can see the build process as it happens

  First start up babel to watch the 'jsx' files and build normal 'js' files. In my case even regular Javascript code is labeled with the .jsx extension so I can tell a processed from unprocessed file.

  `$ babel --watch ./app/assets/javascripts/ --out-dir ./app/assets/js;`

  Second start up webpack to take the processed files and pack them up for 'deployment'. Of course in development we are not 'deploying' but I like to debug as if I was about to. This keeps everything consistant.

  `$ webpack --watch ./app/assets/js/timur.js ./public/js/timur.bundle.js`

  If the `webpack.config.js` file is present in the parent folder you can just run:

  `$ webpack --watch`

## NPM scripted tasks. 

  In the 'package.json' file there are 'tasks' that can be run, which are just short cuts for commands.
  
  ```
  $ npm run clean; // delete the contents of the './js' folder
  $ npm run build; // run babel and webpack one time to 'build' the UI
  $ npm run babel; // run babel on the './jsx' folder and output to the './js' folder
  $ npm run webpack; // run webpack on the entry script and produce a packaged JS app 
  ```

  Again you can look inside the 'package.json' file to see the details of these operations.

## Static Files

  Since we don't keep our images and fonts in the repo we just create symlinks to the static resources.

  ```
  $ sudo -i -u [USER] ln -s /var/www/metis-static/img /var/www/metis/client/img
  $ sudo -i -u [USER] ln -s /var/www/metis-static/fonts /var/www/metis/client/fonts
  ```

## CSS SCSS installation and compilation.

  Install SASS

  ```
  $ gem install sass
  $ sass --watch ./app/assets/scss/timur.scss:./public/css/timur.css
  ```

  Make sure you delete `./public/css/timru.css.map` it's been causeing issues with the css.

