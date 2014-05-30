(function() {
  var $;

  $ = jQuery;

  $.fn.extend({
    multiSelectInput: function(options) {
      var log, settings, showDropdown;
      settings = {
        separator: ',',
        debug: false
      };
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
        var $addbutton, $alreadyExists, $counter, $form, $inputbox, $selectbox, $trigger, $widget, addOptions, setCounter;
        $selectbox = $(this);
        $trigger = $('<button type="button" class="js-multiselectinput__pick">▾</button>');
        $counter = $('<span class="js-multiselectinput__count"></span>');
        $inputbox = $('<input type="text" class="js-multiselectinput__input" placeholder="Create & Add...">');
        $addbutton = $('<button type="button" class="js-multiselectinput__add" disabled>+</button>');
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
        addOptions = function(text) {
          var split;
          split = settings.separator ? text.split(settings.separator) : [text];
          return $.each(split, function(i, v) {
            var $existing, $newOption, term;
            term = v.trim();
            $existing = $alreadyExists(term);
            if ($existing) {
              return $existing.prop('selected', true);
            } else {
              $newOption = $('<option>').val(term);
              $newOption.text(term);
              $selectbox.append($newOption);
              return $newOption.prop('selected', true);
            }
          });
        };
        $addbutton.on('click', function(e) {
          if ($inputbox.val()) {
            addOptions($inputbox.val());
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
        $selectbox.on({
          'focus': function(e) {
            $widget.attr('data-focus', true);
            return false;
          },
          'blur': function(e) {
            $widget.removeAttr('data-expanded', 'data-focus');
            setCounter($selectbox.find(":selected").size());
            $inputbox.focus();
            $inputbox.click();
            return false;
          }
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

}).call(this);

//# sourceMappingURL=multiselectinput.jquery.js.map
