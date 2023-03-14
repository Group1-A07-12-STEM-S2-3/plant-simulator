
var Module;

if (typeof Module === 'undefined') Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');

if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
  Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
(function() {
 var loadPackage = function(metadata) {

  var PACKAGE_PATH;
  if (typeof window === 'object') {
    PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
  } else if (typeof location !== 'undefined') {
      // worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
    } else {
      throw 'using preloaded data can only be done on a web page or in a web worker';
    }
    var PACKAGE_NAME = 'game.data';
    var REMOTE_PACKAGE_BASE = 'game.data';
    if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
      Module['locateFile'] = Module['locateFilePackage'];
      Module.printErr('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
    }
    var REMOTE_PACKAGE_NAME = typeof Module['locateFile'] === 'function' ?
    Module['locateFile'](REMOTE_PACKAGE_BASE) :
    ((Module['filePackagePrefixURL'] || '') + REMOTE_PACKAGE_BASE);

    var REMOTE_PACKAGE_SIZE = metadata.remote_package_size;
    var PACKAGE_UUID = metadata.package_uuid;

    function fetchRemotePackage(packageName, packageSize, callback, errback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', packageName, true);
      xhr.responseType = 'arraybuffer';
      xhr.onprogress = function(event) {
        var url = packageName;
        var size = packageSize;
        if (event.total) size = event.total;
        if (event.loaded) {
          if (!xhr.addedTotal) {
            xhr.addedTotal = true;
            if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
            Module.dataFileDownloads[url] = {
              loaded: event.loaded,
              total: size
            };
          } else {
            Module.dataFileDownloads[url].loaded = event.loaded;
          }
          var total = 0;
          var loaded = 0;
          var num = 0;
          for (var download in Module.dataFileDownloads) {
            var data = Module.dataFileDownloads[download];
            total += data.total;
            loaded += data.loaded;
            num++;
          }
          total = Math.ceil(total * Module.expectedDataFileDownloads/num);
          if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
        } else if (!Module.dataFileDownloads) {
          if (Module['setStatus']) Module['setStatus']('Downloading data...');
        }
      };
      xhr.onerror = function(event) {
        throw new Error("NetworkError for: " + packageName);
      }
      xhr.onload = function(event) {
        if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
          var packageData = xhr.response;
          callback(packageData);
        } else {
          throw new Error(xhr.statusText + " : " + xhr.responseURL);
        }
      };
      xhr.send(null);
    };

    function handleError(error) {
      console.error('package error:', error);
    };

    function runWithFS() {

      function assert(check, msg) {
        if (!check) throw msg + new Error().stack;
      }
      Module['FS_createPath']('C:/Users/yonic/OneDrive/Documents/Projects/Project Sci Experiment 1/Interactive 1.2d', '.vscode', true, true);
      Module['FS_createPath']('C:/Users/yonic/OneDrive/Documents/Projects/Project Sci Experiment 1/Interactive 1.2d', 'source', true, true);
      Module['FS_createPath']('C:/Users/yonic/OneDrive/Documents/Projects/Project Sci Experiment 1/Interactive 1.2d/source', 'assets', true, true);
      Module['FS_createPath']('C:/Users/yonic/OneDrive/Documents/Projects/Project Sci Experiment 1/Interactive 1.2d/source/assets', 'ballads', true, true);
      Module['FS_createPath']('C:/Users/yonic/OneDrive/Documents/Projects/Project Sci Experiment 1/Interactive 1.2d/source/assets', 'classicals', true, true);
      Module['FS_createPath']('C:/Users/yonic/OneDrive/Documents/Projects/Project Sci Experiment 1/Interactive 1.2d/source/assets', 'rocks', true, true);
      Module['FS_createPath']('C:/Users/yonic/OneDrive/Documents/Projects/Project Sci Experiment 1/Interactive 1.2d/source', 'classes', true, true);
      Module['FS_createPath']('C:/Users/yonic/OneDrive/Documents/Projects/Project Sci Experiment 1/Interactive 1.2d/source', 'game-states (unused)', true, true);
      Module['FS_createPath']('C:/Users/yonic/OneDrive/Documents/Projects/Project Sci Experiment 1/Interactive 1.2d/source/game-states (unused)', 'in-games', true, true);
      Module['FS_createPath']('C:/Users/yonic/OneDrive/Documents/Projects/Project Sci Experiment 1/Interactive 1.2d/source/game-states (unused)/in-games', 'classes', true, true);
      Module['FS_createPath']('C:/Users/yonic/OneDrive/Documents/Projects/Project Sci Experiment 1/Interactive 1.2d/source', 'interfaces', true, true);
      Module['FS_createPath']('C:/Users/yonic/OneDrive/Documents/Projects/Project Sci Experiment 1/Interactive 1.2d/source', 'libraries', true, true);
      Module['FS_createPath']('C:/Users/yonic/OneDrive/Documents/Projects/Project Sci Experiment 1/Interactive 1.2d/source/libraries', 'tiny-interface', true, true);
      Module['FS_createPath']('C:/Users/yonic/OneDrive/Documents/Projects/Project Sci Experiment 1/Interactive 1.2d/source/libraries/tiny-interface', 'elements', true, true);

      function DataRequest(start, end, crunched, audio) {
        this.start = start;
        this.end = end;
        this.crunched = crunched;
        this.audio = audio;
      }
      DataRequest.prototype = {
        requests: {},
        open: function(mode, name) {
          this.name = name;
          this.requests[name] = this;
          Module['addRunDependency']('fp ' + this.name);
        },
        send: function() {},
        onload: function() {
          var byteArray = this.byteArray.subarray(this.start, this.end);

          this.finish(byteArray);

        },
        finish: function(byteArray) {
          var that = this;

        Module['FS_createDataFile'](this.name, null, byteArray, true, true, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
        Module['removeRunDependency']('fp ' + that.name);

        this.requests[this.name] = null;
      }
    };

    var files = metadata.files;
    for (i = 0; i < files.length; ++i) {
      new DataRequest(files[i].start, files[i].end, files[i].crunched, files[i].audio).open('GET', files[i].filename);
    }


    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var IDB_RO = "readonly";
    var IDB_RW = "readwrite";
    var DB_NAME = "EM_PRELOAD_CACHE";
    var DB_VERSION = 1;
    var METADATA_STORE_NAME = 'METADATA';
    var PACKAGE_STORE_NAME = 'PACKAGES';
    function openDatabase(callback, errback) {
      try {
        var openRequest = indexedDB.open(DB_NAME, DB_VERSION);
      } catch (e) {
        return errback(e);
      }
      openRequest.onupgradeneeded = function(event) {
        var db = event.target.result;

        if(db.objectStoreNames.contains(PACKAGE_STORE_NAME)) {
          db.deleteObjectStore(PACKAGE_STORE_NAME);
        }
        var packages = db.createObjectStore(PACKAGE_STORE_NAME);

        if(db.objectStoreNames.contains(METADATA_STORE_NAME)) {
          db.deleteObjectStore(METADATA_STORE_NAME);
        }
        var metadata = db.createObjectStore(METADATA_STORE_NAME);
      };
      openRequest.onsuccess = function(event) {
        var db = event.target.result;
        callback(db);
      };
      openRequest.onerror = function(error) {
        errback(error);
      };
    };

    /* Check if there's a cached package, and if so whether it's the latest available */
    function checkCachedPackage(db, packageName, callback, errback) {
      var transaction = db.transaction([METADATA_STORE_NAME], IDB_RO);
      var metadata = transaction.objectStore(METADATA_STORE_NAME);

      var getRequest = metadata.get("metadata/" + packageName);
      getRequest.onsuccess = function(event) {
        var result = event.target.result;
        if (!result) {
          return callback(false);
        } else {
          return callback(PACKAGE_UUID === result.uuid);
        }
      };
      getRequest.onerror = function(error) {
        errback(error);
      };
    };

    function fetchCachedPackage(db, packageName, callback, errback) {
      var transaction = db.transaction([PACKAGE_STORE_NAME], IDB_RO);
      var packages = transaction.objectStore(PACKAGE_STORE_NAME);

      var getRequest = packages.get("package/" + packageName);
      getRequest.onsuccess = function(event) {
        var result = event.target.result;
        callback(result);
      };
      getRequest.onerror = function(error) {
        errback(error);
      };
    };

    function cacheRemotePackage(db, packageName, packageData, packageMeta, callback, errback) {
      var transaction_packages = db.transaction([PACKAGE_STORE_NAME], IDB_RW);
      var packages = transaction_packages.objectStore(PACKAGE_STORE_NAME);

      var putPackageRequest = packages.put(packageData, "package/" + packageName);
      putPackageRequest.onsuccess = function(event) {
        var transaction_metadata = db.transaction([METADATA_STORE_NAME], IDB_RW);
        var metadata = transaction_metadata.objectStore(METADATA_STORE_NAME);
        var putMetadataRequest = metadata.put(packageMeta, "metadata/" + packageName);
        putMetadataRequest.onsuccess = function(event) {
          callback(packageData);
        };
        putMetadataRequest.onerror = function(error) {
          errback(error);
        };
      };
      putPackageRequest.onerror = function(error) {
        errback(error);
      };
    };

    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;

        // copy the entire loaded file into a spot in the heap. Files will refer to slices in that. They cannot be freed though
        // (we may be allocating before malloc is ready, during startup).
        if (Module['SPLIT_MEMORY']) Module.printErr('warning: you should run the file packager with --no-heap-copy when SPLIT_MEMORY is used, otherwise copying into the heap may fail due to the splitting');
        var ptr = Module['getMemory'](byteArray.length);
        Module['HEAPU8'].set(byteArray, ptr);
        DataRequest.prototype.byteArray = Module['HEAPU8'].subarray(ptr, ptr+byteArray.length);

        var files = metadata.files;
        for (i = 0; i < files.length; ++i) {
          DataRequest.prototype.requests[files[i].filename].onload();
        }
        Module['removeRunDependency']('datafile_game.data');

      };
      Module['addRunDependency']('datafile_game.data');

      if (!Module.preloadResults) Module.preloadResults = {};

      function preloadFallback(error) {
        console.error(error);
        console.error('falling back to default preload behavior');
        fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, processPackageData, handleError);
      };

      openDatabase(
        function(db) {
          checkCachedPackage(db, PACKAGE_PATH + PACKAGE_NAME,
            function(useCached) {
              Module.preloadResults[PACKAGE_NAME] = {fromCache: useCached};
              if (useCached) {
                console.info('loading ' + PACKAGE_NAME + ' from cache');
                fetchCachedPackage(db, PACKAGE_PATH + PACKAGE_NAME, processPackageData, preloadFallback);
              } else {
                console.info('loading ' + PACKAGE_NAME + ' from remote');
                fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE,
                  function(packageData) {
                    cacheRemotePackage(db, PACKAGE_PATH + PACKAGE_NAME, packageData, {uuid:PACKAGE_UUID}, processPackageData,
                      function(error) {
                        console.error(error);
                        processPackageData(packageData);
                      });
                  }
                  , preloadFallback);
              }
            }
            , preloadFallback);
        }
        , preloadFallback);

      if (Module['setStatus']) Module['setStatus']('Downloading...');

    }
    if (Module['calledRun']) {
      runWithFS();
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
    }

  }
  loadPackage({"package_uuid":"40cf0dcc-4f50-422f-906e-f26b8cd72f5e","remote_package_size":138731532,"files":[{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\.vscode\\settings.json","crunched":0,"start":0,"end":196,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\conf.lua","crunched":0,"start":196,"end":589,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\main.lua","crunched":0,"start":589,"end":8896,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\asset-loader.lua","crunched":0,"start":8896,"end":11109,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\04B_03__.TTF","crunched":0,"start":11109,"end":30601,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\assets-list.lua","crunched":0,"start":30601,"end":36038,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\background-city.png","crunched":0,"start":36038,"end":114570,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\background-desk.png","crunched":0,"start":114570,"end":115064,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\background-sun.png","crunched":0,"start":115064,"end":115243,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\background-trees.png","crunched":0,"start":115243,"end":116086,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\ballads\\Adele - Hello.mp3","crunched":0,"start":116086,"end":4857552,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\ballads\\Air Supply - Every Woman In The World.mp3","crunched":0,"start":4857552,"end":8450048,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\ballads\\BTS - The Truth Untold.mp3","crunched":0,"start":8450048,"end":12371896,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\ballads\\Celine Dion - My Heart Will Go On.mp3","crunched":0,"start":12371896,"end":16774397,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\ballads\\Celine Dion - The Power Of Love.mp3","crunched":0,"start":16774397,"end":22255650,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\ballads\\Christina Perri - A Thousand Years.mp3","crunched":0,"start":22255650,"end":26863787,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\ballads\\Elvis Presley - Cant Help Falling In Love.mp3","crunched":0,"start":26863787,"end":29756201,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\ballads\\Queen - Good Old-Fashioned Lover Boy.mp3","crunched":0,"start":29756201,"end":32575054,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\ballads\\TWICE - Doughnut.mp3","crunched":0,"start":32575054,"end":36981734,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\ballads\\Westlife - Swear It Again.mp3","crunched":0,"start":36981734,"end":40929913,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\BestTen-CRT.otf","crunched":0,"start":40929913,"end":45166233,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\classicals\\Beethoven - Fur  Elise.mp3","crunched":0,"start":45166233,"end":47968368,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\classicals\\Beethoven - Moonlight Sonata 3rd Movement.mp3","crunched":0,"start":47968368,"end":55244756,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\classicals\\Bizet - Carmen  Overture.mp3","crunched":0,"start":55244756,"end":58627854,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\classicals\\Grieg - In the Hall of the Mountain King.mp3","crunched":0,"start":58627854,"end":61220173,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\classicals\\Johann Strauss II -  The Blue Danube Waltz.mp3","crunched":0,"start":61220173,"end":71767232,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\classicals\\Mozart - Eine Kleine Nachtmusik.mp3","crunched":0,"start":71767232,"end":77329987,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\classicals\\Niel - Erika.mp3","crunched":0,"start":77329987,"end":80587279,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\classicals\\Offenbach - Can Can Music.mp3","crunched":0,"start":80587279,"end":82699363,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\classicals\\Rossini - William Tell Overture Final.mp3","crunched":0,"start":82699363,"end":85960417,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\classicals\\Tchaikovsky - Nutcracker Suite Russian Dance Trepak.mp3","crunched":0,"start":85960417,"end":87204400,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\clock.png","crunched":0,"start":87204400,"end":87204584,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\desk.png","crunched":0,"start":87204584,"end":87205079,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\frame-button.png","crunched":0,"start":87205079,"end":87205213,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\frame-window.png","crunched":0,"start":87205213,"end":87205409,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\frame.png","crunched":0,"start":87205409,"end":87205626,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\icon-add.png","crunched":0,"start":87205626,"end":87205765,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\icon-close.png","crunched":0,"start":87205765,"end":87205903,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\icon-lock.png","crunched":0,"start":87205903,"end":87206055,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\icon-more.png","crunched":0,"start":87206055,"end":87206171,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\icon-music.png","crunched":0,"start":87206171,"end":87206370,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\icon-next.png","crunched":0,"start":87206370,"end":87206513,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\icon-pot-1.png","crunched":0,"start":87206513,"end":87206696,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\icon-pot-2.png","crunched":0,"start":87206696,"end":87206910,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\icon-preview.png","crunched":0,"start":87206910,"end":87207059,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\icon-previous.png","crunched":0,"start":87207059,"end":87207207,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\icon-start.png","crunched":0,"start":87207207,"end":87207395,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\JF-Dot-jiskan16.ttf","crunched":0,"start":87207395,"end":90376855,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\JF-Dot-Kaname12.ttf","crunched":0,"start":90376855,"end":92079459,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\pot.png","crunched":0,"start":92079459,"end":92079698,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\rocks\\Bon Jovi - Livin On A Prayer.mp3","crunched":0,"start":92079698,"end":96062568,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\rocks\\Dead Or Alive - You Spin Me Round (Like a Record).mp3","crunched":0,"start":96062568,"end":99210773,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\rocks\\Eagles - Hotel California.mp3","crunched":0,"start":99210773,"end":105474446,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\rocks\\Led Zepelin - Kashmir.mp3","crunched":0,"start":105474446,"end":113750174,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\rocks\\Linkin Park - In The End.mp3","crunched":0,"start":113750174,"end":117243613,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\rocks\\Mother Mother - Hayloft II.mp3","crunched":0,"start":117243613,"end":120689405,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\rocks\\Nirvana - Heart-Shaped Box.mp3","crunched":0,"start":120689405,"end":125238191,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\rocks\\Sabaton - Bismarck.mp3","crunched":0,"start":125238191,"end":130263451,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\rocks\\The Beatles - Hey Jude.mp3","crunched":0,"start":130263451,"end":134679326,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\rocks\\UNDEAD CORPORATION - Embraced by the Flame.mp3","crunched":0,"start":134679326,"end":138664285,"audio":true},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\setting-icon.png","crunched":0,"start":138664285,"end":138664410,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\slider.png","crunched":0,"start":138664410,"end":138664613,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\speaker.png","crunched":0,"start":138664613,"end":138664839,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\assets\\trees.png","crunched":0,"start":138664839,"end":138665848,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\classes\\pot.lua","crunched":0,"start":138665848,"end":138666415,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\game-state.lua","crunched":0,"start":138666415,"end":138668589,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\game-states (unused)\\in-game.lua","crunched":0,"start":138668589,"end":138674372,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\game-states (unused)\\in-games\\classes\\pot.lua","crunched":0,"start":138674372,"end":138675045,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\game-states (unused)\\in-games\\init.lua","crunched":0,"start":138675045,"end":138676000,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\game-states (unused)\\intro.lua","crunched":0,"start":138676000,"end":138677040,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\game-states (unused)\\main-menu.lua","crunched":0,"start":138677040,"end":138682734,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\interfaces\\main.lua","crunched":0,"start":138682734,"end":138686525,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\interfaces\\more.lua","crunched":0,"start":138686525,"end":138688723,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\interfaces\\music.lua","crunched":0,"start":138688723,"end":138697899,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\interfaces\\pots.lua","crunched":0,"start":138697899,"end":138701693,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\libraries\\timer.lua","crunched":0,"start":138701693,"end":138710411,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\libraries\\tiny-interface\\bare.lua","crunched":0,"start":138710411,"end":138712246,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\libraries\\tiny-interface\\elements\\box.lua","crunched":0,"start":138712246,"end":138713606,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\libraries\\tiny-interface\\elements\\frame.lua","crunched":0,"start":138713606,"end":138717810,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\libraries\\tiny-interface\\elements\\slider.lua","crunched":0,"start":138717810,"end":138722243,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\libraries\\tiny-interface\\event.lua","crunched":0,"start":138722243,"end":138723381,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\libraries\\tiny-interface\\group.lua","crunched":0,"start":138723381,"end":138724994,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\libraries\\tiny-interface\\init.lua","crunched":0,"start":138724994,"end":138725795,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\libraries\\tiny-interface\\signal.lua","crunched":0,"start":138725795,"end":138726841,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\libraries\\tiny-interface\\system.lua","crunched":0,"start":138726841,"end":138727884,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\libraries\\tiny-interface\\utilities.lua","crunched":0,"start":138727884,"end":138728522,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\utilities.lua","crunched":0,"start":138728522,"end":138728980,"audio":false},{"filename":"C:\\Users\\yonic\\OneDrive\\Documents\\Projects\\Project Sci Experiment 1\\Interactive 1.2d\\source\\virtual-screen.lua","crunched":0,"start":138728980,"end":138731532,"audio":false}]});

})();
