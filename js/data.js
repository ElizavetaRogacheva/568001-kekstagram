'use strict';
(function () {
  var PICTURE_AMOUNT = 25;
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

  window.data = {
    arrayOfPictures: makeArrayOfPictures(PICTURE_AMOUNT),
    renderCommentsArea: renderCommentsArea
  };
})();