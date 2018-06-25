'use strict';
var PICTURE_AMOUNT = 25;
var SIZE_STEP = 25;
var ESC_KEYCODE = 27;
var MAX_HASHTAGS = 5;
var MAX_HASHTAG_SYMBOLS = 20;
var MIN_HASHTAG_SYMBOLS = 2;

var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var descriptions = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var arrayOfUrl = [];
var currentValue = 100;
var effects = ['none', 'chrome', 'sepia', 'marvin', 'phobos', 'heat'];
var currentEffect = null;

var picturesBlock = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture')
.content
.querySelector('.picture__link');

var bigPicture = document.querySelector('.big-picture');
var image = document.querySelector('.img-upload__preview img');
var minusButton = document.querySelector('.resize__control--minus');
var plusButton = document.querySelector('.resize__control--plus');
var sizeIndicator = document.querySelector('.resize__control--value');
var imgUpload = document.querySelector('.img-upload__preview');
var submitButton = document.querySelector('.img-upload__submit');
var hashtagInput = document.querySelector('.text__hashtags');

var getRandomIndex = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var checkUrl = function (url, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === url) {
      return false;
    }
  }
  return true;
};

var getUrl = function () {
  var infinityCycle = true;
  while (infinityCycle) {
    var urlIndex = getRandomIndex(1, 26);
    var pictureUrl = 'photos/' + urlIndex + '.jpg';
    if (checkUrl(pictureUrl, arrayOfUrl)) {
      arrayOfUrl.push(pictureUrl);
      return pictureUrl;
    }
  }
  return null;
};

var makeComment = function (stringsArray) {
  var stringAmountIndex = getRandomIndex(1, 3);
  var comment = [];
  var copyOfComments = stringsArray.slice();
  for (var i = 0; i < stringAmountIndex; i++) {
    var copyOfCommentsIndex = getRandomIndex(0, copyOfComments.length);
    comment.push(copyOfComments[copyOfCommentsIndex]);
    copyOfComments.splice(copyOfCommentsIndex, 1);
  }
  return comment.join(' ');
};

var makePicture = function () {
  var likesIndex = getRandomIndex(15, 201);
  var commentAmountIndex = getRandomIndex(0, 6);
  var descriptionIndex = getRandomIndex(0, descriptions.length);
  var commentsArray = [];
  for (var i = 0; i < commentAmountIndex; i++) {
    commentsArray[i] = makeComment(comments);
  }
  var picture = {
    url: getUrl(),
    likes: likesIndex,
    comments: commentsArray,
    descriptions: descriptions[descriptionIndex]
  };
  return picture;
};

var makeArrayOfPictures = function (numOfPictures) {
  var pictures = [];
  for (var i = 0; i < numOfPictures; i++) {
    pictures[i] = makePicture();
  }
  return pictures;
};

var arrayOfPictures = makeArrayOfPictures(PICTURE_AMOUNT);

var renderPicture = function (pictureObject) {
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = pictureObject.url;
  pictureElement.querySelector('.picture__stat--likes').textContent = pictureObject.likes;
  pictureElement.querySelector('.picture__stat--comments').textContent = pictureObject.comments.length;
  pictureElement.addEventListener('click', function () {
    renderBigPicture(pictureObject);
  });
  return pictureElement;
};

var drawElements = function () {
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < arrayOfPictures.length; j++) {
    fragment.appendChild(renderPicture(arrayOfPictures[j]));
  }
  picturesBlock.appendChild(fragment);
};

var hideBlocks = function () {
  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.social__loadmore').classList.add('visually-hidden');
};

var getCommentImg = function () {
  var commentImg = document.createElement('img');
  commentImg.classList.add('social__picture');
  commentImg.src = 'img/avatar-' + getRandomIndex(1, 7) + '.svg';
  commentImg.alt = 'Автатр комментатора фото';
  commentImg.width = '35';
  commentImg.height = '35';
  return commentImg;
};

var getCommentText = function (text) {
  var commentText = document.createElement('p');
  commentText.classList.add('social__text');
  commentText.textContent = text;
  return commentText;
};

var renderCommentsArea = function (pictureObject) {
  var commentsArea = document.querySelector('.social__comments');
  commentsArea.innerHTML = '';
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pictureObject.comments.length; i++) {
    var commentItem = document.createElement('li');
    commentItem.classList.add('social__comment', 'social__comment--text');
    commentItem.appendChild(getCommentImg());
    commentItem.appendChild(getCommentText(pictureObject.comments[i]));
    fragment.appendChild(commentItem);
    commentsArea.appendChild(fragment);
  }
};


var closeBigPictureBlock = function (block) {
  var bigPictureClose = document.querySelector('.big-picture__cancel');
  bigPictureClose.addEventListener('click', function () {
    block.classList.add('hidden');
    document.querySelector('body').classList.remove('modal-open');
  });
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      block.classList.add('hidden');
      document.querySelector('body').classList.remove('modal-open');
    }
  });
};

var renderBigPicture = function (pictureObject) {
  bigPicture.classList.remove('hidden');
  document.querySelector('body').classList.add('modal-open');
  document.querySelector('.big-picture__img img').src = pictureObject.url;
  document.querySelector('.likes-count').textContent = pictureObject.likes;
  document.querySelector('.comments-count').textContent = pictureObject.comments.length;
  document.querySelector('.social__caption').textContent = pictureObject.descriptions;
  renderCommentsArea(pictureObject);
  closeBigPictureBlock(bigPicture);
};

var openAndCloseUploadBlock = function () {
  var uploadFileBlock = document.querySelector('#upload-file');
  var editingBlock = document.querySelector('.img-upload__overlay');
  var cancelButton = document.querySelector('#upload-cancel');
  uploadFileBlock.addEventListener('change', function () {
    editingBlock.classList.remove('hidden');
  });
  cancelButton.addEventListener('click', function () {
    editingBlock.classList.add('hidden');
  });
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
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
    originalImage.classList.remove('effects__preview--' + currentEffect);
    currentEffect = effectName;
    originalImage.classList.add('effects__preview--' + effectName);
  };
};

var applyEffect = function () {
  for (var i = 0; i < effects.length; i++) {
    var effectButton = document.querySelector('#effect-' + effects[i]);
    effectButton.addEventListener('click', effectHandlerConstructor(effects[i], image));
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

var scaleLine = document.querySelector('.scale__line');
var scalePin = document.querySelector('.scale__pin');
var scaleLevel = document.querySelector('.scale__level');
var scaleValue = document.querySelector('.scale__value');
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

    scaleValue.value = (scalePin.offsetLeft - shift.x);
    scalePin.style.left = scaleValue.value + 'px';
    scaleLevel.style.width = scaleValue.value + 'px';
  };

  var pinMouseUpHandler = function (upEvt) {
    upEvt.preventDefault();


    document.removeEventListener('mousemove', pinMouseMooveHandler);
    document.removeEventListener('mouseup', pinMouseUpHandler);
  };

  document.addEventListener('mousemove', pinMouseMooveHandler);
  document.addEventListener('mouseup', pinMouseUpHandler);
});

checkHashtagValidity();
drawElements();
hideBlocks();
openAndCloseUploadBlock();
createSizeButtonsActions();
applyEffect();
