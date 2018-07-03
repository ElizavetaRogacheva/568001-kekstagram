'use strict';
(function () {
  var NEW_PHOTOS_AMOUNT = 10;
  var photos = [];
  var currentPhotos = [];
  var picturesBlock = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture__link');
  var imgFilters = document.querySelector('.img-filters');

  var filterButtons = {
    popular: document.querySelector('#filter-popular'),
    new: document.querySelector('#filter-new'),
    discussed: document.querySelector('#filter-discussed')
  };

  window.picture = {
    arrayOfPictures: []
  };

  var drawPhotos = function (elem) {
    var fragment = document.createDocumentFragment();
    for (var j = 0; j < elem.length; j++) {
      fragment.appendChild(renderPicture(elem[j]));
    }
    picturesBlock.appendChild(fragment);
  };

  var onLoadDataFromServer = function (object) {
    photos = object;
    drawPhotos(object);
    imgFilters.classList.remove('img-filters--inactive');
  };

  var onErrorDataFromServer = function (object) {
    window.picture.arrayOfPictures = [];
    window.utils.drawErrorElement(object);
  };

  // обработчики
  var popularButtonClickHandler = function () {
    drawPhotos(photos);
  };

  var newButtonClickHandler = function () {
    var newPhotos = [];
    for (var i = 0; i < NEW_PHOTOS_AMOUNT; i++) {
      var index = window.data.getRandomIndex(0, photos.length - 1);
      newPhotos.push(photos[index]);
      photos.splice(index, 1);
    }
    console.log(newPhotos);
    drawPhotos(newPhotos);
  };

  var discussedButtonClickHandler = function () {
    photos.sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
    drawPhotos(photos);
    console.log(photos);
  };

  // обработка событий
  filterButtons.popular.addEventListener('click', function () {
    popularButtonClickHandler();
  });

  filterButtons.new.addEventListener('click', function () {
    newButtonClickHandler();
  });

  filterButtons.discussed.addEventListener('click', function () {
    discussedButtonClickHandler();
  });

  var renderPicture = function (pictureObject) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = pictureObject.url;
    pictureElement.querySelector('.picture__stat--likes').textContent = pictureObject.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = pictureObject.comments.length;
    pictureElement.addEventListener('click', function () {
      window.preview.renderBigPicture(pictureObject);
    });
    return pictureElement;
  };

  window.backend.getDataFromServer(onLoadDataFromServer, onErrorDataFromServer);
})();
