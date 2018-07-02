'use strict';

(function () {
  var bigPicture = document.querySelector('.big-picture');

  var hideBlocks = function () {
    document.querySelector('.social__comment-count').classList.add('visually-hidden');
    document.querySelector('.social__loadmore').classList.add('visually-hidden');
  };

  var closeBigPictureBlock = function (block) {
    var bigPictureClose = document.querySelector('.big-picture__cancel');
    bigPictureClose.addEventListener('click', function () {
      block.classList.add('hidden');
      document.querySelector('body').classList.remove('modal-open');
    });
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.utils.ESC_KEYCODE) {
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
    window.data.renderCommentsArea(pictureObject);
    closeBigPictureBlock(bigPicture);
  };

  window.preview = {
    hideBlocks: hideBlocks,
    renderBigPicture: renderBigPicture
  };
})();
