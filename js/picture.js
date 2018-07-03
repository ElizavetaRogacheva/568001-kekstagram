'use strict';
(function () {
  var picturesBlock = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture__link');
  var imgFilters = document.querySelector('.img-filters');

  window.picture = {
    arrayOfPictures: []
  };

  var photos = [];

  var onLoadDataFromServer = function (object) {
    photos = object;
    var fragment = document.createDocumentFragment();
    for (var j = 0; j < object.length; j++) {
      fragment.appendChild(renderPicture(object[j]));
    }
    picturesBlock.appendChild(fragment);
    imgFilters.classList.remove('img-filters--inactive');
  };

  var onErrorDataFromServer = function (object) {
    window.picture.arrayOfPictures = [];
    window.utils.drawErrorElement(object);
  };

  window.backend.getDataFromServer(onLoadDataFromServer, onErrorDataFromServer);

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
})();
