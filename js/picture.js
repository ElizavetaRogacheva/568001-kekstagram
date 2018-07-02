'use strict';
(function () {
  var picturesBlock = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture__link');

  var renderPicture = function (pictureObject) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = pictureObject.url;
    pictureElement.querySelector('.picture__stat--likes').textContent = pictureObject.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = pictureObject.comments.length;
    pictureElement.addEventListener('click', function () {
      preview.renderBigPicture(pictureObject);
    });
    return pictureElement;
  };

  var drawElements = function () {
    var fragment = document.createDocumentFragment();
    for (var j = 0; j < data.arrayOfPictures.length; j++) {
      fragment.appendChild(renderPicture(data.arrayOfPictures[j]));
    }
    picturesBlock.appendChild(fragment);
  };

  window.picture = {
    drawElements: drawElements
  };
})();
