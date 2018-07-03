'use strict';
(function () {
  var ESC_KEYCODE = 27;

  var drawErrorElement = function (error) {
    var body = document.querySelector('body');
    var fragment = document.createDocumentFragment();
    var errorText = document.createElement('p');
    errorText.textContent = error;
    fragment.appendChild(errorText);
    body.appendChild(fragment);
    fragment.style.width = '100';
    fragment.style.height = '40';
    fragment.style.background = 'white';
  };
  window.utils = {
    ESC_KEYCODE: ESC_KEYCODE,
    drawErrorElement: drawErrorElement
  };
})();
