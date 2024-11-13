
$(document).ready(function () {

  // Reset the window scroll position to top on every page load and re-load
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }

  // Auto hide app welcome on load
  function hideAppWelcomeDelay() {
    // window.setTimeout(hideAppWelcome, 1500);
    window.setTimeout(hideAppWelcome, 1750);
  }
  function hideAppWelcome() {
    $('body').removeClass('welcome-is-visible');
  }
  hideAppWelcomeDelay();

  // Auto remove body loading class to have a hook to prevent UI bugs
  function removeLoadingClassDelay() {
    window.setTimeout(removeLoadingClass, 3250);
  }
  function removeLoadingClass() {
    $('body').removeClass('is-loading');
  }
  removeLoadingClassDelay();

  if (window.matchMedia) {
    // Check for dark mode preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      appThemeRemoveAll();
      $('body').addClass('theme--04'); // Dark theme
      $('.controller-theme .slider').val(4);
    } else {
      appThemeRemoveAll();
      $('body').addClass('theme--00'); // Light theme
      $('.controller-theme .slider').val(0);
    }
  }

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
  $('.intro .option.creativedirector').click(function () {
    $('.intro .option.creativedirector').addClass('is-active');
    $('.intro .text.creativedirector').addClass('is-visible');
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

  // Make theme slider visible on hover on no touch devices
  $('html.no-touchevents .option.theme').mouseenter(function () {
    $('body').addClass('theme-slider--is--visible');
  });
  $('html.no-touchevents .option.theme').mouseleave(function () {
    $('body').removeClass('theme-slider--is--visible');
  });

  // Make theme slider visible on tap on touch devices
  $('html.touchevents .option.theme').click(function () {
    $('body').addClass('theme-slider--is--visible');
  });
  // Make theme slider invisible if anything besides the slider is tapped
  $('html.touchevents').click(function (event) {
    if (!$(event.target).closest('.option.theme').length) {
      $('body').removeClass('theme-slider--is--visible');
    }
  });

  // Theme slider
  $('.controller-theme .slider').on('input', function () {
    var sliderValue = $(this).val();

    // put in a leading zero
    if (sliderValue < 10) {
      sliderValue = 0 + sliderValue;
    }
    // console.log(sliderValue);

    // detect and remove class names that start with 'theme--'
    appThemeRemoveAll();

    // add new class name
    $('body').addClass('theme--' + sliderValue);
  });
// Toggle between black and white themes
function appTheme() {
  if ( $('body').hasClass('theme--00') ){
    appThemeRemoveAll();
    $('body').addClass('theme--04');
    $('.controller-theme .slider').val(5);
  }
  else {
       appThemeRemoveAll();
       $('body').addClass('theme--00');
       $('.controller-theme .slider').val(0);
  }
}

// detect and remove class names that start with 'theme--'
function appThemeRemoveAll() {
  $('body').removeClass(function (index, themeClassName) {
    return (themeClassName.match (/(^|\s)theme--\S+/g) || []).join(' ');
  });
}

// Cycle through all themes
function appThemeSpectrum() {
  if ( $('body').hasClass('theme--04') ){
            appThemeRemoveAll();
            $('body').addClass('theme--03');
            $('.controller-theme .slider').val(3);
  }
  else if ( $('body').hasClass('theme--03') ){
            appThemeRemoveAll();
            $('body').addClass('theme--02');
            $('.controller-theme .slider').val(2);
  }
  else if ( $('body').hasClass('theme--02') ){
            appThemeRemoveAll();
            $('body').addClass('theme--01');
            $('.controller-theme .slider').val(1);
  }
  else if ( $('body').hasClass('theme--01') ){
            appThemeRemoveAll();
            $('body').addClass('theme--00');
            $('.controller-theme .slider').val(0);
  }
  else if ( $('body').hasClass('theme--04') ){
            appThemeRemoveAll();
            $('body').addClass('theme--00');
            $('.controller-theme .slider').val(4);
  }
}

});