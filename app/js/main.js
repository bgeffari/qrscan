import QRReader from './vendor/qrscan.js';
import styles from '../css/styles.css';

window.addEventListener('DOMContentLoaded', () => {
  //To check the device and add iOS support
  window.iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
  window.isMediaStreamAPISupported = navigator && navigator.mediaDevices && 'enumerateDevices' in navigator.mediaDevices;
  window.noCameraPermission = false;

  var copiedText = null;
  var frame = null;

  var dialogElement = document.querySelector('.app__dialog');
  var dialogOverlayElement = document.querySelector('.app__dialog-overlay');
  var dialogOpenBtnElement = document.querySelector('.app__dialog-open');
  var dialogCloseBtnElement = document.querySelector('.app__dialog-close');
  var scanningEle = document.querySelector('.custom-scanner');
  var textBoxEle = document.querySelector('#result');
  var helpTextEle = document.querySelector('.app__help-text');
  var infoSvg = document.querySelector('.app__header-icon svg');
  var videoElement = document.querySelector('video');
  window.appOverlay = document.querySelector('.app__overlay');

  //Initializing qr scanner
  window.addEventListener('load', event => {
    QRReader.init(); //To initialize QR Scanner
    // Set camera overlay size
    setTimeout(() => {
      setCameraOverlay();
      if (window.isMediaStreamAPISupported) {
        scan();
      }
    }, 1000);
  });

  function setCameraOverlay() {
    window.appOverlay.style.borderStyle = 'solid';
  }

  function createFrame() {
    frame = document.createElement('img');
    frame.src = '';
    frame.id = 'frame';
  }

  //Dialog close btn event
  dialogCloseBtnElement.addEventListener('click', hideDialog, false);

  //To open result in browser
  function openInBrowser() {
    console.log('Result: ', copiedText);
    window.open(copiedText, '_blank', 'toolbar=0,location=0,menubar=0');
    copiedText = null;
    hideDialog();
  }

  //Scan
  function scan(forSelectedPhotos = false) {
    if (window.isMediaStreamAPISupported && !window.noCameraPermission) {
      scanningEle.style.display = 'block';
    }

    if (forSelectedPhotos) {
      scanningEle.style.display = 'block';
    }

    QRReader.scan(result => {
      scanningEle.style.display = 'none';
      console.log(result);
      if (result.length > 13) {
        doCheckIn(result)
          .then(response => {
            // handle success response here
            console.log(`Got success: ${response}`);

            document.querySelector('div.app__dialog-content').innerText = response;
            dialogElement.classList.remove('app__dialog--hide');
            dialogOverlayElement.classList.remove('app__dialog--hide');
            const frame = document.querySelector('#frame');
          })
          .catch(error => {
            // handle error here
            console.log(`Got error: ${error}`);
          });
      }

      // if (forSelectedPhotos && frame) frame.remove();
    }, forSelectedPhotos);
  }

  //Hide dialog
  function hideDialog() {
    copiedText = null;

    if (!window.isMediaStreamAPISupported) {
      frame.src = '';
      frame.className = '';
    }

    dialogElement.classList.add('app__dialog--hide');
    dialogOverlayElement.classList.add('app__dialog--hide');
    div.classList.replace(/\bbg.*?\b/g, 'bg-success');
    scan();
  }
});

function doCheckIn(token) {
  var https = require('https');
  const url = 'https://qcc.evntez.com/userCheckin/' + token;
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        var { statusCode } = res;
        var contentType = res.headers['content-type'];

        let error;

        if (statusCode !== 200) {
          error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
        }

        if (error) {
          // console.error(error.message);
          // consume response data to free up memory
          res.resume();
        }

        res.setEncoding('utf8');
        let rawData = '';

        res.on('data', chunk => {
          rawData += chunk;
        });

        res.on('end', () => {
          try {
            const parsedData = rawData;
            resolve(parsedData);
          } catch (e) {
            reject(`Got error: ${e.message}`);
          }
        });
      })
      .on('error', e => {
        reject(`Got error: ${e.message}`);
      });
  });
}
