'use strict';
(function () {
  var NEW_PHOTOS_AMOUNT = 10;
  var photos = [];
  var currentButton = null;
  var picturesBlock = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture__link');
  var imgFilters = document.querySelector('.img-filters');
  var fragment = document.createDocumentFragment();

  var filterButtons = {
    popular: document.querySelector('#filter-popular'),
    new: document.querySelector('#filter-new'),
    discussed: document.querySelector('#filter-discussed')
  };

  window.picture = {
    arrayOfPictures: []
  };

  var drawPhotos = function (elem) {
    elem.forEach(function (element) {
      fragment.appendChild(renderPicture(element));
    });
    picturesBlock.appendChild(fragment);
  };

  var removePhotos = function () {
    picturesBlock.querySelectorAll('.picture__link').forEach(function (element) {
      picturesBlock.removeChild(element);
    });
  };

  var onLoadDataFromServer = function (object) {
    photos = object.slice(0, object.length);
    drawPhotos(object);
    imgFilters.classList.remove('img-filters--inactive');
    currentButton = filterButtons.popular;
  };

  var onErrorDataFromServer = function (object) {
    window.picture.arrayOfPictures = [];
    window.utils.drawErrorElement(object);
  };

  // обработчики
  var popularButtonClickHandler = function () {
    currentButton.classList.remove('img-filters__button--active');
    currentButton = filterButtons.popular;
    currentButton.classList.add('img-filters__button--active');
    removePhotos();
    drawPhotos(photos);
  };

  var newButtonClickHandler = function () {
    currentButton.classList.remove('img-filters__button--active');
    currentButton = filterButtons.new;
    currentButton.classList.add('img-filters__button--active');
    removePhotos();
    var copysOfPhotos = photos.slice(0, photos.length);
    var newPhotos = [];
    for (var i = 0; i < NEW_PHOTOS_AMOUNT; i++) {
      var index = window.data.getRandomIndex(0, copysOfPhotos.length - 1);
      newPhotos.push(copysOfPhotos[index]);
      copysOfPhotos.splice(index, 1);
    }
    drawPhotos(newPhotos);
  };

  var discussedButtonClickHandler = function () {
    currentButton.classList.remove('img-filters__button--active');
    currentButton = filterButtons.discussed;
    currentButton.classList.add('img-filters__button--active');
    removePhotos();
    var copysOfPhotos = photos.slice(0, photos.length);
    copysOfPhotos.sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
    drawPhotos(copysOfPhotos);
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
