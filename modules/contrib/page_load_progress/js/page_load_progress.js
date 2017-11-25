/**
 * @file
 * Defines the behavior of the Page Load Progress module.
 *
 * Page Load Progress sets a screen lock showing a spinner when the user clicks
 * on an element that triggers a time consuming task.
 */

(function ($, Drupal) {

  'use strict';

  Drupal.behaviors.page_load_progress = {
    attach: function (context, settings) {
      var delay = Number(settings.page_load_progress.delay);
      var elements = String(settings.page_load_progress.elements).split(',');
      var esc_key = Boolean(settings.page_load_progress.esc_key);
      var screen_lock = '<div class="page-load-progress-lock-screen page-load-progress-hidden">\n\
                         <div class="page-load-progress-throbber"></div>\n\
                         </div>';
      var body = $('body', context, settings);

      // Add the screen lock behavior for each configured element.
      for (var i in elements) {
        // Prevents from getting in the way of HTML 5 form validation.
        $(elements[i]).parents('form').submit(function () {
          setTimeout(lockScreen, delay);
        });
      }

      // Allows ESC key to kill the throbber.
      if (esc_key) {
        document.onkeydown = function(evt) {
          evt = evt || window.event;
          var isEscape = false;
          if ("key" in evt) {
            // "Escape" is standard in modern browsers. "Esc" is primarily for
            // Internet Explorer 9 and Firefox 36 and earlier.
            isEscape = (evt.key === "Escape" || evt.key === "Esc");
          } else {
            // keyCode is getting deprecated. Keeping it for legacy reasons.
            isEscape = evt.keyCode === 27;
          }
          if (isEscape) {
            $('.page-load-progress-lock-screen').remove();
          }
        };
      }

      /**
       * Lock screen method.
       *
       * This method locks the screen by displaying the screen_lock HTML DOM
       * part as a full page overlay.
       */
      var lockScreen = function () {
        body.append(screen_lock);
        body.css({
          'overflow' : 'hidden'
        });
        $('.page-load-progress-lock-screen').fadeIn('slow');
      }
    }
  };

})(jQuery, Drupal);
