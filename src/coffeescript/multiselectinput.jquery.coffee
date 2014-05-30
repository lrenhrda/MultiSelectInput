# Reference jQuery
$ = jQuery

# Adds plugin object to jQuery
$.fn.extend
  multiSelectInput: (options) ->
    # Default settings
    settings =
      separator: ','
      debug: false

    # Merge default settings with options.
    settings = $.extend settings, options

    # Simple logger.
    log = (msg) ->
      console?.log msg if settings.debug

    # For Android... ugh
    showDropdown = (el)->
      e = document.createEvent 'MouseEvents'
      e.initMouseEvent 'mousedown', true, true, window 
      el.dispatchEvent(e)

    # _Insert magic here._
    return @each ()->

      $selectbox = $(this)

      $trigger = $('<button type="button" class="js-multiselectinput__pick">▾</button>')
      $counter = $('<span class="js-multiselectinput__count"></span>')
      $inputbox = $('<input type="text" class="js-multiselectinput__input" placeholder="Create & Add...">')
      $addbutton = $('<button type="button" class="js-multiselectinput__add" disabled>+</button>')
      $widget = $selectbox.wrap('<div class="js-multiselectinput"></div>').parent()
      $form = $(this).parents('form').eq(0)

      if $.msiIsMobile.iOS()
        $widget.attr 'data-ios', true

      if $.msiIsMobile.Android()
        $widget.attr 'data-android', true

      if $.msiIsMobile.any() 
        $widget.attr 'data-mobile', true

      $inputbox.on 
        'focus': (e)->
          $addbutton.removeAttr 'disabled'
        'blur': (e)->
          if !$inputbox.val()
            $addbutton.attr 'disabled', true

      $form.on 'submit', (e)->
        if $inputbox.is(":focus")
          $addbutton.click()
          false

      $alreadyExists = (value)->
        x = null
        regex = new RegExp '^' + value + '$', 'i'
        $('option', $selectbox).each ->
          if regex.test $(this).val()
            x = $(this)
        return x

      setCounter = (count)->
        if count > 0
          $counter.text count
        else 
          $counter.text ''

      addOptions = (text)->
        split = if settings.separator then text.split(settings.separator) else [text]
        $.each split, (i, v)->
          term = v.trim()
          $existing = $alreadyExists(term)
          if $existing
            $existing.prop 'selected', true 
          else 
            $newOption = $('<option>').val term 
            $newOption.text term
            $selectbox.append $newOption
            $newOption.prop 'selected', true

      $addbutton.on 'click', (e)->
        if $inputbox.val()
          addOptions $inputbox.val()
          $inputbox.val('')
          setCounter($selectbox.find(":selected").size())
          # Some AJAX here to add the tag to the DB
        false

      $trigger.on 'mousedown', (e)->
        if $widget.attr 'data-expanded'
          $selectbox.blur()
          $widget.removeAttr 'data-expanded'
        else 
          $selectbox.focus()
          showDropdown($selectbox[0])
          $widget.attr 'data-expanded', true
        false
      
      $selectbox.on
        'focus': (e)->
          $widget.attr 'data-focus', true
          false 
        'blur': (e)->
          $widget.removeAttr 'data-expanded', 'data-focus'
          setCounter($selectbox.find(":selected").size())
          $inputbox.focus()
          $inputbox.click()
          false

      $selectbox.on 'mousedown', 'option', (e)->
        e.preventDefault()
        $(this).prop 'selected', !$(this).prop 'selected'
        console.log $(this).text() + ", " + $(this).prop 'selected'
        false

      $inputbox.on 'keydown', (e)->
        if e.which == 40 
          $selectbox.focus()

      $selectbox.on 'keydown', (e)->
        if e.which == 27
          $selectbox.blur()
        if e.which == 13
          return false

      $trigger.append $counter
      $widget.prepend $trigger
      $widget.append $inputbox
      $widget.append $addbutton

$.extend
  msiIsMobile:
    Android: ->
      /Android/i.test navigator.userAgent
    BlackBerry: ->
      /BlackBerry/i.test navigator.userAgent
    iOS: ->
      /iPhone|iPad|iPod/i.test navigator.userAgent
    Windows: ->
      /IEMobile/i.test navigator.userAgent
    any: ->
      (@.Android() || @.BlackBerry() || @.iOS() || @.Windows())