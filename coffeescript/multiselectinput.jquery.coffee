# Reference jQuery
$ = jQuery

# Adds plugin object to jQuery
$.fn.extend
  multiSelectInput: (options) ->
    # Default settings
    # settings =
    #   option1: true
    #   option2: false
    #   debug: false

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
      # log "Preparing magic show."
      # You can use your settings in here now.
      # log "Option 1 value: #{settings.option1}"

      $selectbox = $(this)
      
      tagIconSvg = '<svg class="js-multiselectinput__icon" width="100%" height="100%" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="16" sketch:type="MSArtboardGroup" fill="#000000"><path d="M0,0 L4.4408921e-16,7.06237793 L8.95344413,16.0158221 L15.9847108,8.9845554 L7.04707304,0.0469176489 L0,0 Z M3.5,5 C4.32842712,5 5,4.32842712 5,3.5 C5,2.67157288 4.32842712,2 3.5,2 C2.67157288,2 2,2.67157288 2,3.5 C2,4.32842712 2.67157288,5 3.5,5 Z" id="Path-1" sketch:type="MSShapeGroup"></path></g></g></svg>'
      addIconSvg = '<svg class="js-multiselectinput__icon" width="100%" height="100%" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="16" sketch:type="MSArtboardGroup" fill="#000000"><path d="M6,6 L6,0 L10,0 L10,6 L16,6 L16,10 L10,10 L10,16 L6,16 L6,10 L0,10 L0,6 L6,6 Z" id="Rectangle-1" sketch:type="MSShapeGroup"></path></g></g></svg>'

      $trigger = $('<button type="button" class="js-multiselectinput__pick">' + tagIconSvg + '</button>')
      $counter = $('<span class="js-multiselectinput__count"></span>')
      $inputbox = $('<input type="text" class="js-multiselectinput__input" placeholder="Create & Add...">')
      $addbutton = $('<button type="button" class="js-multiselectinput__add" disabled>' + addIconSvg + '</button>')
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

      $addbutton.on 'click', (e)->
        if $inputbox.val()
          $existing = $alreadyExists($inputbox.val())
          if $existing 
            console.log $inputbox.val() + ", exists, true"
            $existing.prop 'selected', true 
          else 
            $newOption = $('<option>').val $inputbox.val()
            $newOption.text $inputbox.val()
            $selectbox.append $newOption
            console.log $newOption.val() + ", added, true"
            $newOption.prop 'selected', true
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
      
      $selectbox.on 'blur', (e)->
        $widget.removeAttr 'data-expanded'
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