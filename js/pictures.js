'use strict';

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

var getRandomIndex = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// проверка комментария на идентичность
var checkComment = function (string, arrayComments) {
  for (var i = 0; i < arrayComments.length; i++) {
    if (arrayComments[i] === string) {
      return false;
    }
  }
  return true;
};

// создание комментария
var getComment = function (paramComments) {
  var infinityCycle = true;
  while (infinityCycle) {
    var commentStringIndex = getRandomIndex(0, comments.length);
    var commentString = comments[commentStringIndex];
    if (checkComment(commentString, paramComments)) {
      return commentString;
    }
  }
};

var arrayOfUrl = [];

// проверка идентичности адреса картинки
var checkUrl = function (url, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === url) {
      return false;
    }
  }
  return true;
};

// создание адреса картинки
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
};

var makePicture = function () {
  var likesIndex = getRandomIndex(15, 201);
  var commentAmountIndex = getRandomIndex(1, 3);
  var descriptionIndex = getRandomIndex(0, descriptions.length);
  var commentsArray = [];
  for (var i = 0; i < commentAmountIndex; i++) {
    commentsArray[i] = getComment(commentsArray);
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

var arrayOfPictures = makeArrayOfPictures(25);

var picturesBlock = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture__link');

// наполнение данными из массива
var renderPicture = function (pictureObject) {
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = pictureObject.url;
  pictureElement.querySelector('.picture__stat--likes').textContent = pictureObject.likes;
  pictureElement.querySelector('.picture__stat--comments').textContent = pictureObject.comments.length;
  return pictureElement;
};

// создание и отрисовка элементов
var fragment = document.createDocumentFragment();
for (var j = 0; j < arrayOfPictures.length; j++) {
  fragment.appendChild(renderPicture(arrayOfPictures[j]));
}
picturesBlock.appendChild(fragment);

var bigPicture = document.querySelector('.big-picture');
bigPicture.classList.remove('hidden');
document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.social__loadmore').classList.add('visually-hidden');

var makeString = function (array) {
  var commentString = '';
  for (var i = 0; i < array.length; i++) {
    commentString += array[i] + '';
  }
  return commentString;
};

var renderBigPicture = function (pictureObject) {
  document.querySelector('.big-picture__img img').src = pictureObject.url;
  document.querySelector('.likes-count').textContent = pictureObject.likes;
  document.querySelector('.comments-count').textContent = pictureObject.comments.length;
  document.querySelector('.social__comment p').textContent = makeString(pictureObject.comments);
  document.querySelector('.social__comment:nth-child(2) p').textContent = makeString(pictureObject.comments);
  document.querySelector('.social__comment .social__picture').src = 'img/avatar-' + getRandomIndex(1, 7) + '.svg';
  document.querySelector('.social__comment:nth-child(2) .social__picture').src = 'img/avatar-' + getRandomIndex(1, 7) + '.svg';
  document.querySelector('.social__caption').textContent = pictureObject.descriptions;
};

renderBigPicture(arrayOfPictures[0]);

