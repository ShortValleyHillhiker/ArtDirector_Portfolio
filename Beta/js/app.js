
$(document).ready(function () {

  // Reset the window scroll position to top on every page load and re-load
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }

  // Auto hide app cover on load
  function hideAppCoverDelay() {
    // window.setTimeout(hideAppCover, 1500);
    window.setTimeout(hideAppCover, 1750);
  }
  function hideAppCover() {
    $('body').removeClass('cover-is-visible');
  }
  hideAppCoverDelay();

  // Auto remove body loading class to have a hook to prevent UI bugs
  function removeLoadingClassDelay() {
    window.setTimeout(removeLoadingClass, 3250);
  }
  function removeLoadingClass() {
    $('body').removeClass('is-loading');
  }
  removeLoadingClassDelay();

  // Intro section options
  $('.intro .options').scroll(function () {
    var introOptionsScrollLeft = $('.intro .options').scrollLeft();
    if (introOptionsScrollLeft > 0) {
      $('.intro .gradient-mask.left').addClass('is-visible');
    }
    else {
      $('.intro .gradient-mask.left').removeClass('is-visible');
    }
  });
  $('.intro .option').click(function () {
    $('.intro .option').removeClass('is-active');
    $('.intro .text').removeClass('is-visible');
  });
  $('.intro .option.vemsom').click(function () {
    $('.intro .option.vemsom').addClass('is-active');
    $('.intro .text.vemsom').addClass('is-visible');
  });
  $('.intro .option.rekryterare').click(function () {
    $('.intro .option.rekryterare').addClass('is-active');
    $('.intro .text.rekryterare').addClass('is-visible');
  });
  $('.intro .option.byrachefer').click(function () {
    $('.intro .option.byrachefer').addClass('is-active');
    $('.intro .text.byrachefer').addClass('is-visible');
  });
  $('.intro .option.designchefer').click(function () {
    $('.intro .option.designchefer').addClass('is-active');
    $('.intro .text.designchefer').addClass('is-visible');
  });
  $('.intro .option.copywriters').click(function () {
    $('.intro .option.copywriters').addClass('is-active');
    $('.intro .text.copywriters').addClass('is-visible');
  });
  $('.intro .option.artdirectors').click(function () {
    $('.intro .option.artdirectors').addClass('is-active');
    $('.intro .text.artdirectors').addClass('is-visible');
  });

});