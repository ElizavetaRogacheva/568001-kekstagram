'use strict';
(function () {
  var photos = [];
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

  };
  // обработка событий
  filterButtons.popular.addEventListener('click', function () {
    popularButtonClickHandler();
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
