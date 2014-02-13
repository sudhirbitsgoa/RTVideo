RTVideo
=======

Made for demo purpose only.

Real-time video encoding application built with Node.js, Express, Passport and MongoDB.

Make sure you have both `avconv` (or use `ffmpeg` instead) and `mongodb` installed, as well as `node.js`, `npm` and `bower`:

###MongoDB
Download: [docs.mongodb.org/manual/installation](http://docs.mongodb.org/manual/installation/). Add to PATH and run `mongod --dbpath=/path/to/db/`, where `/path/to/db` is already existing directory.

###Node.js & NPM
```
sudo apt-get install python-software-properties python g++ make
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
```

Create a symlink: `sudo ln -s /usr/bin/nodejs /usr/bin/node`

###Bower
```
sudo npm install -g bower
```
Install dependencies:
`sudo npm install && bower install` and run with `node app.js`
