'use strict';

var SIZE_STEP = 25;
var MAX_HASHTAGS = 5;
var MAX_HASHTAG_SYMBOLS = 20;
var MIN_HASHTAG_SYMBOLS = 2;
var SCALE_LINE_WIDTH = 450;
var MAX_BLUR = 3;

var currentValue = 100;
var effects = ['none', 'chrome', 'sepia', 'marvin', 'phobos', 'heat'];
var currentEffect = null;

var image = document.querySelector('.img-upload__preview img');
var minusButton = document.querySelector('.resize__control--minus');
var plusButton = document.querySelector('.resize__control--plus');
var sizeIndicator = document.querySelector('.resize__control--value');
var imgUpload = document.querySelector('.img-upload__preview');
var submitButton = document.querySelector('.img-upload__submit');
var hashtagInput = document.querySelector('.text__hashtags');
var scaleValue = document.querySelector('.scale__value');
var scalePin = document.querySelector('.scale__pin');
var scaleLevel = document.querySelector('.scale__level');
var imgUploadScale = document.querySelector('.img-upload__scale');

var openAndCloseUploadBlock = function () {
  var uploadFileBlock = document.querySelector('#upload-file');
  var editingBlock = document.querySelector('.img-upload__overlay');
  var cancelButton = document.querySelector('#upload-cancel');
  uploadFileBlock.addEventListener('change', function () {
    editingBlock.classList.remove('hidden');
    imgUploadScale.classList.add('hidden');
  });
  cancelButton.addEventListener('click', function () {
    editingBlock.classList.add('hidden');
  });
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      editingBlock.classList.add('hidden');
    }
  });
};

var changeSize = function (size) {
  imgUpload.style.transform = 'scale(' + size + ')';
};

var createSizeButtonsActions = function () {
  plusButton.addEventListener('click', function () {
    currentValue = Math.min(currentValue + SIZE_STEP, 100);
    sizeIndicator.value = currentValue + '%';
    changeSize(currentValue / 100);
  });
  minusButton.addEventListener('click', function () {
    currentValue = Math.max(currentValue - SIZE_STEP, 25);
    sizeIndicator.value = currentValue + '%';
    changeSize(currentValue / 100);
  });
};


var effectHandlerConstructor = function (effectName, originalImage) {
  return function () {
    imgUploadScale.classList.remove('hidden');
    scalePin.style.left = '100%';
    scaleLevel.style.width = '100%';
    originalImage.classList.remove('effects__preview--' + currentEffect);
    currentEffect = effectName;
    originalImage.classList.add('effects__preview--' + effectName);
    getFilterSaturation(SCALE_LINE_WIDTH);
  };
};

var applyEffect = function () {
  for (var i = 0; i < effects.length; i++) {
    var effectButton = document.querySelector('#effect-' + effects[i]);
    effectButton.addEventListener('click', effectHandlerConstructor(effects[i], image));
    if (effects[i] === 'none') {
      effectButton.addEventListener('click', function () {
        imgUploadScale.classList.add('hidden');
      });
    }
  }
};


var getHashtagArray = function () {
  var hashtagValue = hashtagInput.value.toLowerCase();
  var hashtagArray = hashtagValue.split(' ');
  return hashtagArray;
};

var checkHashtagIdentity = function () {
  var hashtagArray = getHashtagArray();
  for (var i = 0; i < hashtagArray.length - 1; i++) {
    for (var j = i + 1; j < hashtagArray.length; j++) {
      if (hashtagArray[i] === hashtagArray[j]) {
        return false;
      }
    }
  }
  return true;
};

var checkFirstSymbol = function () {
  var hashtagArray = getHashtagArray();
  for (var i = 0; i < hashtagArray.length; i++) {
    if (hashtagArray[i][0] !== '#') {
      return false;
    }
  }
  return true;
};

var checkHashtagSpace = function () {
  var hashtagArray = getHashtagArray();
  for (var i = 0; i < hashtagArray.length; i++) {
    for (var j = i + 1; j < hashtagArray[i].length; j++) {
      if (hashtagArray[i][j] === '#') {
        return false;
      }
    }
  }
  return true;
};

var checkHashtagAmount = function () {
  var hashtagArray = getHashtagArray();
  if (hashtagArray.length > MAX_HASHTAGS) {
    return false;
  }
  return true;
};

var checkHashtagLength = function () {
  var hashtagArray = getHashtagArray();
  for (var i = 0; i < hashtagArray.length; i++) {
    if (hashtagArray[i].length > MAX_HASHTAG_SYMBOLS || hashtagArray[i].length < MIN_HASHTAG_SYMBOLS) {
      return false;
    }
  }
  return true;
};

var checkHashtagValidity = function () {
  submitButton.addEventListener('click', function () {
    if (!checkHashtagIdentity()) {
      hashtagInput.setCustomValidity('Присутствуют одинаковые хэш-теги');
    } else if (!checkFirstSymbol()) {
      hashtagInput.setCustomValidity('Хэш-тег должен начинаться с символа "#"');
    } else if (!checkHashtagSpace()) {
      hashtagInput.setCustomValidity('Хэш-теги должны разделяться пробелом');
    } else if (!checkHashtagAmount()) {
      hashtagInput.setCustomValidity('Количество хэш-тегов не может быть больше 5');
    } else if (!checkHashtagLength()) {
      hashtagInput.setCustomValidity('Длина хэш-тега не должна превышать 20 символов, хэш-тег не может содержать одиночную решетку');
    } else {
      hashtagInput.setCustomValidity('');
    }
  });
};

var movePin = function () {
  scalePin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX
    };

    var pinMouseMooveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX
      };

      startCoords = {
        x: moveEvt.clientX
      };

      scaleValue.value = selectAverageAmount(0, scalePin.offsetLeft - shift.x, SCALE_LINE_WIDTH);
      scalePin.style.left = scaleValue.value + 'px';
      scaleLevel.style.width = scaleValue.value + 'px';
      getFilterSaturation(scalePin.offsetLeft - shift.x);

    };

    var pinMouseUpHandler = function (upEvt) {
      upEvt.preventDefault();


      document.removeEventListener('mousemove', pinMouseMooveHandler);
      document.removeEventListener('mouseup', pinMouseUpHandler);
    };

    document.addEventListener('mousemove', pinMouseMooveHandler);
    document.addEventListener('mouseup', pinMouseUpHandler);
  });
};


var getFilterSaturation = function (currentCoords) {
  var originalImage = document.querySelector('.img-upload__preview img');
  var saturationDegree = currentCoords / SCALE_LINE_WIDTH;
  if (currentEffect === 'chrome') {
    originalImage.style.filter = 'grayscale(' + saturationDegree + ')';
  } if (currentEffect === 'sepia') {
    originalImage.style.filter = 'sepia(' + saturationDegree + ')';
  } if (currentEffect === 'marvin') {
    originalImage.style.filter = 'invert(' + saturationDegree * 100 + '%)';
  } if (currentEffect === 'phobos') {
    originalImage.style.filter = 'blur(' + saturationDegree * MAX_BLUR + 'px)';
  } if (currentEffect === 'heat') {
    var newSaturationDegree = 1 + 2 * saturationDegree;
    originalImage.style.filter = 'brightness(' + newSaturationDegree + ')';
  }
};

var selectAverageAmount = function (minParam, currentParam, maxParam) {
  if (currentParam < minParam) {
    return minParam;
  } if (currentParam > maxParam) {
    return maxParam;
  } else {
    return currentParam;
  }
};


checkHashtagValidity();

openAndCloseUploadBlock();

createSizeButtonsActions();
applyEffect();
movePin();
