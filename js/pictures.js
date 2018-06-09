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

var checkComment = function (string, arrayComments) {
  for (var i = 0; i < arrayComments.length; i++) {
    if (arrayComments[i] === string) {
      return false;
    }
  }
  return true;
};

var getComment = function (paramComments) {
  while (true) {
    var commentStringIndex = getRandomIndex(0, comments.length);
    var commentString = comments[commentStringIndex];
    if (checkComment(commentString, paramComments)) {
    return commentString;
    }
  }
};

var makePicture = function () {
   var urlIndex = getRandomIndex(1, 26);
   var likesIndex = getRandomIndex(15, 201);
   var commentAmountIndex = getRandomIndex(1, 3);
   var descriptionIndex = getRandomIndex(0, descriptions.length);
   var commentsArray = [];
   for (var i = 0; i < commentAmountIndex; i++) {
    commentsArray[i] = getComment(commentsArray);
   }
   var picture = {
    url: 'photos/' + urlIndex + '.jpg',
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

makeArrayOfPictures(25);

