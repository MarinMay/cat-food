'use strict';
(function () {
  var cardWrapper = document.querySelector('.card-grid');

  function getElement(evt, className) {
    var element = evt.target;

    if (!Element.prototype.closest) {
      while (!element.classList.contains(className)) {
        if (element === cardWrapper) {
          element = null;
          break;
        }
        element = element.parentNode;
      }
    } else {
      element = element.closest('.' + className);
    }
    return element;
  }

  function onCardMouseOut() {
    this.classList.add('product-card--selected-hover');
    this.removeEventListener('mouseout', onCardMouseOut);
  }

  function toggleCardStatus(evt) {
    var card = getElement(evt, 'product-card');
    if (card && !card.classList.contains('product-card--disabled')) {
      if (!card.classList.contains('product-card--selected')) {
        card.classList.add('product-card--selected');
        card.addEventListener('mouseout', onCardMouseOut);
      } else {
        card.classList.remove('product-card--selected-hover');
        card.classList.remove('product-card--selected');
        card.removeEventListener('mouseout', onCardMouseOut);
      }
    }
  }

  function onCardClick(evt) {
    evt.preventDefault();

    var linkPack = getElement(evt, 'product-card__link-pack');
    var isTargetLinkWord = evt.target.classList.contains('product-card__link-word') ? true : false;

    if (linkPack || isTargetLinkWord) {
      toggleCardStatus(evt);
    }
  }

  cardWrapper.addEventListener('click', onCardClick);
})();
