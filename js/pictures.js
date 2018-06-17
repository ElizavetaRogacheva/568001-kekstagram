'use strict';
var PICTURE_AMOUNT = 25;
var SIZE_STEP = 25;

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
  var usedStrings = [];
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
  })
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
  })
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
};

var changeSize = function (size) {
  imgUpload.style.transform = 'scale(' + size + ')';
}

var createSizeButtonsActions = function () {
  plusButton.addEventListener('click', function () {
    currentValue = Math.min(currentValue + SIZE_STEP, 100);
    sizeIndicator.value = currentValue + '%';
    changeSize(currentValue/100);
  })
  minusButton.addEventListener('click', function () {
    currentValue = Math.max(currentValue - SIZE_STEP, 25);
    sizeIndicator.value = currentValue + '%';
    changeSize(currentValue/100);
  })
};

var EffectHandlerConstructor = function (effectName, image) {
  return function () {
    image.classList.remove('effects__preview--' + currentEffect);
    currentEffect = effectName;
    image.classList.add('effects__preview--' + effectName);
  }
}

var applyEffect = function () {
  for (var i = 0; i < effects.length; i++) {
    var effectButton = document.querySelector('#effect-' + effects[i]);
    effectButton.addEventListener('click', EffectHandlerConstructor(effects[i], image));
  }
};

drawElements();
hideBlocks();
openAndCloseUploadBlock();
createSizeButtonsActions();
applyEffect();


