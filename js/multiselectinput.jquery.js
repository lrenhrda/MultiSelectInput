;(function($){
  $.fn.extend({
    multiSelectInput: function(options) {
      var log, settings, showDropdown;
      settings = $.extend(settings, options);
      log = function(msg) {
        if (settings.debug) {
          return typeof console !== "undefined" && console !== null ? console.log(msg) : void 0;
        }
      };
      showDropdown = function(el) {
        var e;
        e = document.createEvent('MouseEvents');
        e.initMouseEvent('mousedown', true, true, window);
        return el.dispatchEvent(e);
      };
      return this.each(function() {
        var $addbutton, $alreadyExists, $counter, $form, $inputbox, $selectbox, $trigger, $widget, addIconSvg, setCounter, tagIconSvg;
        $selectbox = $(this);
        tagIconSvg = '<svg class="js-multiselectinput__icon" width="100%" height="100%" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="16" sketch:type="MSArtboardGroup" fill="#000000"><path d="M0,0 L4.4408921e-16,7.06237793 L8.95344413,16.0158221 L15.9847108,8.9845554 L7.04707304,0.0469176489 L0,0 Z M3.5,5 C4.32842712,5 5,4.32842712 5,3.5 C5,2.67157288 4.32842712,2 3.5,2 C2.67157288,2 2,2.67157288 2,3.5 C2,4.32842712 2.67157288,5 3.5,5 Z" id="Path-1" sketch:type="MSShapeGroup"></path></g></g></svg>';
        addIconSvg = '<svg class="js-multiselectinput__icon" width="100%" height="100%" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="16" sketch:type="MSArtboardGroup" fill="#000000"><path d="M6,6 L6,0 L10,0 L10,6 L16,6 L16,10 L10,10 L10,16 L6,16 L6,10 L0,10 L0,6 L6,6 Z" id="Rectangle-1" sketch:type="MSShapeGroup"></path></g></g></svg>';
        $trigger = $('<button type="button" class="js-multiselectinput__pick">' + tagIconSvg + '</button>');
        $counter = $('<span class="js-multiselectinput__count"></span>');
        $inputbox = $('<input type="text" class="js-multiselectinput__input" placeholder="Create & Add...">');
        $addbutton = $('<button type="button" class="js-multiselectinput__add" disabled>' + addIconSvg + '</button>');
        $widget = $selectbox.wrap('<div class="js-multiselectinput"></div>').parent();
        $form = $(this).parents('form').eq(0);
        if ($.msiIsMobile.iOS()) {
          $widget.attr('data-ios', true);
        }
        if ($.msiIsMobile.Android()) {
          $widget.attr('data-android', true);
        }
        if ($.msiIsMobile.any()) {
          $widget.attr('data-mobile', true);
        }
        $inputbox.on({
          'focus': function(e) {
            return $addbutton.removeAttr('disabled');
          },
          'blur': function(e) {
            if (!$inputbox.val()) {
              return $addbutton.attr('disabled', true);
            }
          }
        });
        $form.on('submit', function(e) {
          if ($inputbox.is(":focus")) {
            $addbutton.click();
            return false;
          }
        });
        $alreadyExists = function(value) {
          var regex, x;
          x = null;
          regex = new RegExp('^' + value + '$', 'i');
          $('option', $selectbox).each(function() {
            if (regex.test($(this).val())) {
              return x = $(this);
            }
          });
          return x;
        };
        setCounter = function(count) {
          if (count > 0) {
            return $counter.text(count);
          } else {
            return $counter.text('');
          }
        };
        $addbutton.on('click', function(e) {
          var $existing, $newOption;
          if ($inputbox.val()) {
            $existing = $alreadyExists($inputbox.val());
            if ($existing) {
              console.log($inputbox.val() + ", exists, true");
              $existing.prop('selected', true);
            } else {
              $newOption = $('<option>').val($inputbox.val());
              $newOption.text($inputbox.val());
              $selectbox.append($newOption);
              console.log($newOption.val() + ", added, true");
              $newOption.prop('selected', true);
            }
            $inputbox.val('');
            setCounter($selectbox.find(":selected").size());
          }
          return false;
        });
        $trigger.on('mousedown', function(e) {
          if ($widget.attr('data-expanded')) {
            $selectbox.blur();
            $widget.removeAttr('data-expanded');
          } else {
            $selectbox.focus();
            showDropdown($selectbox[0]);
            $widget.attr('data-expanded', true);
          }
          return false;
        });
        $selectbox.on('blur', function(e) {
          $widget.removeAttr('data-expanded');
          setCounter($selectbox.find(":selected").size());
          $inputbox.focus();
          $inputbox.click();
          return false;
        });
        $selectbox.on('mousedown', 'option', function(e) {
          e.preventDefault();
          $(this).prop('selected', !$(this).prop('selected'));
          console.log($(this).text() + ", " + $(this).prop('selected'));
          return false;
        });
        $inputbox.on('keydown', function(e) {
          if (e.which === 40) {
            return $selectbox.focus();
          }
        });
        $selectbox.on('keydown', function(e) {
          if (e.which === 27) {
            $selectbox.blur();
          }
          if (e.which === 13) {
            return false;
          }
        });
        $trigger.append($counter);
        $widget.prepend($trigger);
        $widget.append($inputbox);
        return $widget.append($addbutton);
      });
    }
  });

  $.extend({
    msiIsMobile: {
      Android: function() {
        return /Android/i.test(navigator.userAgent);
      },
      BlackBerry: function() {
        return /BlackBerry/i.test(navigator.userAgent);
      },
      iOS: function() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
      },
      Windows: function() {
        return /IEMobile/i.test(navigator.userAgent);
      },
      any: function() {
        return this.Android() || this.BlackBerry() || this.iOS() || this.Windows();
      }
    }
  });
})(jQuery);