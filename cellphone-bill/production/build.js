/*!
 * Bootstrap v3.2.0 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') { throw new Error('Bootstrap\'s JavaScript requires jQuery') }

/* ========================================================================
 * Bootstrap: transition.js v3.2.0
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.2.0
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.2.0'

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.2.0
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.2.0'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    $el[val](data[state] == null ? this.options[state] : data[state])

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    Plugin.call($btn, 'toggle')
    e.preventDefault()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.2.0
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element).on('keydown.bs.carousel', $.proxy(this.keydown, this))
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.2.0'

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true
  }

  Carousel.prototype.keydown = function (e) {
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.2.0
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.2.0'

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      Plugin.call(actives, 'hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(350)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') option = !option
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var href
    var $this   = $(this)
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle="collapse"][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.2.0
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.2.0'

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.trigger('focus')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.divider):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $parent = getParent($(this))
      var relatedTarget = { relatedTarget: this }
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role="menu"], [role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.2.0
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options        = options
    this.$body          = $(document.body)
    this.$element       = $(element)
    this.$backdrop      =
    this.isShown        = null
    this.scrollbarWidth = 0

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.2.0'

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.$body.addClass('modal-open')

    this.setScrollbar()
    this.escape()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.$body.removeClass('modal-open')

    this.resetScrollbar()
    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(150) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  Modal.prototype.checkScrollbar = function () {
    if (document.body.clientWidth >= window.innerWidth) return
    this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', '')
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.2.0
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.2.0'

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(document.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var $parent      = this.$element.parent()
        var parentDim    = this.getPosition($parent)

        placement = placement == 'bottom' && pos.top   + pos.height       + actualHeight - parentDim.scroll > parentDim.height ? 'top'    :
                    placement == 'top'    && pos.top   - parentDim.scroll - actualHeight < 0                                   ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth      > parentDim.width                                    ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth      < parentDim.left                                     ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(150) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var arrowDelta          = delta.left ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowPosition       = delta.left ? 'left'        : 'top'
    var arrowOffsetPosition = delta.left ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], arrowPosition)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + '%') : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    this.$element.removeAttr('aria-describedby')

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element.trigger('hidden.bs.' + that.type)
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(150) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element
    var el     = $element[0]
    var isBody = el.tagName == 'BODY'
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : null, {
      scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop(),
      width:  isBody ? $(window).width()  : $element.outerWidth(),
      height: isBody ? $(window).height() : $element.outerHeight()
    }, isBody ? { top: 0, left: 0 } : $element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    return (this.$tip = this.$tip || $(this.options.template))
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    clearTimeout(this.timeout)
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.2.0
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.2.0'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').empty()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.2.0
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var process  = $.proxy(this.process, this)

    this.$body          = $('body')
    this.$scrollElement = $(element).is('body') ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', process)
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.2.0'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = 'offset'
    var offsetBase   = 0

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.offsets = []
    this.targets = []
    this.scrollHeight = this.getScrollHeight()

    var self     = this

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop <= offsets[0]) {
      return activeTarget != (i = targets[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')

    var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.2.0
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.2.0'

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.2.0
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      =
    this.unpin        =
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.2.0'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin != null) this.$element.css('top', '')

    var affixType = 'affix' + (affix ? '-' + affix : '')
    var e         = $.Event(affixType + '.bs.affix')

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

    this.$element
      .removeClass(Affix.RESET)
      .addClass(affixType)
      .trigger($.Event(affixType.replace('affix', 'affixed')))

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - this.$element.height() - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

if(typeof JSON!=="object"){JSON={}}(function(){"use strict";function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var cx,escapable,gap,indent,meta,rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else if(typeof space==="string"){indent=space}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}})();(function(){var namespace="StripeCheckout.require".split("."),name=namespace[namespace.length-1],base=this,i;for(i=0;i<namespace.length-1;i++){base=base[namespace[i]]=base[namespace[i]]||{}}if(base[name]===undefined){base[name]=function(){var modules={},cache={};var requireRelative=function(name,root){var path=expand(root,name),indexPath=expand(path,"./index"),module,fn;module=cache[path]||cache[indexPath];if(module){return module}else if(fn=modules[path]||modules[path=indexPath]){module={id:path,exports:{}};cache[path]=module.exports;fn(module.exports,function(name){return require(name,dirname(path))},module);return cache[path]=module.exports}else{throw"module "+name+" not found"}};var expand=function(root,name){var results=[],parts,part;if(/^\.\.?(\/|$)/.test(name)){parts=[root,name].join("/").split("/")}else{parts=name.split("/")}for(var i=0,length=parts.length;i<length;i++){part=parts[i];if(part==".."){results.pop()}else if(part!="."&&part!=""){results.push(part)}}return results.join("/")};var dirname=function(path){return path.split("/").slice(0,-1).join("/")};var require=function(name){return requireRelative(name,"")};require.define=function(bundle){for(var key in bundle){modules[key]=bundle[key]}};require.modules=modules;require.cache=cache;return require}.call()}})();StripeCheckout.require.define({"vendor/cookie":function(exports,require,module){var cookie={};var pluses=/\+/g;function extend(target,other){target=target||{};for(var prop in other){if(typeof source[prop]==="object"){target[prop]=extend(target[prop],source[prop])}else{target[prop]=source[prop]}}return target}function raw(s){return s}function decoded(s){return decodeURIComponent(s.replace(pluses," "))}function converted(s){if(s.indexOf('"')===0){s=s.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")}try{return config.json?JSON.parse(s):s}catch(er){}}var config=cookie.set=cookie.get=function(key,value,options){if(value!==undefined){options=extend(options,config.defaults);if(typeof options.expires==="number"){var days=options.expires,t=options.expires=new Date;t.setDate(t.getDate()+days)}value=config.json?JSON.stringify(value):String(value);return document.cookie=[config.raw?key:encodeURIComponent(key),"=",config.raw?value:encodeURIComponent(value),options.expires?"; expires="+options.expires.toUTCString():"",options.path?"; path="+options.path:"",options.domain?"; domain="+options.domain:"",options.secure?"; secure":""].join("")}var decode=config.raw?raw:decoded;var cookies=document.cookie.split("; ");var result=key?undefined:{};for(var i=0,l=cookies.length;i<l;i++){var parts=cookies[i].split("=");var name=decode(parts.shift());var cookie=decode(parts.join("="));if(key&&key===name){result=converted(cookie);break}if(!key){result[name]=converted(cookie)}}return result};config.defaults={};cookie.remove=function(key,options){if(cookie.get(key)!==undefined){cookie.set(key,"",extend(options,{expires:-1}));return true}return false};module.exports=cookie}});StripeCheckout.require.define({"vendor/ready":function(exports,require,module){!function(name,definition){if(typeof module!="undefined")module.exports=definition();else if(typeof define=="function"&&typeof define.amd=="object")define(definition);else this[name]=definition()}("domready",function(ready){var fns=[],fn,f=false,doc=document,testEl=doc.documentElement,hack=testEl.doScroll,domContentLoaded="DOMContentLoaded",addEventListener="addEventListener",onreadystatechange="onreadystatechange",readyState="readyState",loadedRgx=hack?/^loaded|^c/:/^loaded|c/,loaded=loadedRgx.test(doc[readyState]);function flush(f){loaded=1;while(f=fns.shift())f()}doc[addEventListener]&&doc[addEventListener](domContentLoaded,fn=function(){doc.removeEventListener(domContentLoaded,fn,f);flush()},f);hack&&doc.attachEvent(onreadystatechange,fn=function(){if(/^c/.test(doc[readyState])){doc.detachEvent(onreadystatechange,fn);flush()}});return ready=hack?function(fn){self!=top?loaded?fn():fns.push(fn):function(){try{testEl.doScroll("left")}catch(e){return setTimeout(function(){ready(fn)},50)}fn()}()}:function(fn){loaded?fn():fns.push(fn)}})}});(function(){if(!Array.prototype.indexOf){Array.prototype.indexOf=function(obj,start){var f,i,j,_i;j=this.length;f=start?start:0;for(i=_i=f;f<=j?_i<j:_i>j;i=f<=j?++_i:--_i){if(this[i]===obj){return i}}return-1}}}).call(this);StripeCheckout.require.define({"lib/helpers":function(exports,require,module){(function(){var delurkWinPhone,helpers,uaVersionFn;uaVersionFn=function(re){return function(){var uaMatch;uaMatch=helpers.userAgent.match(re);return uaMatch&&parseInt(uaMatch[1])}};delurkWinPhone=function(fn){return function(){return fn()&&!helpers.isWindowsPhone()}};helpers={userAgent:window.navigator.userAgent,escape:function(value){return value&&(""+value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;")},sanitizeURL:function(value){if(!value){return}value=value.replace(/javascript/g,"");return encodeURI(value)},iOSVersion:uaVersionFn(/(?:iPhone OS |iPad; CPU OS )(\d+)_\d+/),androidWebkitVersion:uaVersionFn(/Mozilla\/5\.0.*Android.*AppleWebKit\/([\d]+)/),androidVersion:uaVersionFn(/Android (\d+)\.\d+/),firefoxVersion:uaVersionFn(/Firefox\/(\d+)\.\d+/),chromeVersion:uaVersionFn(/Chrome\/(\d+)\.\d+/),safariVersion:uaVersionFn(/Version\/(\d+)\.\d+ Safari/),iOSChromeVersion:uaVersionFn(/CriOS\/(\d+)\.\d+/),ieVersion:uaVersionFn(/(?:MSIE |Trident\/.*rv:)(\d{1,2})\./),isiOSChrome:function(){return/CriOS/.test(helpers.userAgent)},isiOSWebView:function(){return/(iPhone|iPod|iPad).*AppleWebKit((?!.*Safari)|(.*\([^)]*like[^)]*Safari[^)]*\)))/i.test(helpers.userAgent)},isiOS:delurkWinPhone(function(){return/(iPhone|iPad|iPod)/i.test(helpers.userAgent)}),isiPad:function(){return/(iPad)/i.test(helpers.userAgent)},isMac:delurkWinPhone(function(){return/mac/i.test(helpers.userAgent)}),isWindowsPhone:function(){return/(Windows\sPhone|IEMobile)/i.test(helpers.userAgent)},isWindowsOS:function(){return/(Windows NT \d\.\d)/i.test(helpers.userAgent)},isIE:function(){return/(MSIE ([0-9]{1,}[\.0-9]{0,})|Trident\/)/i.test(helpers.userAgent)},isChrome:function(){return"chrome"in window},isSafari:delurkWinPhone(function(){var userAgent;userAgent=helpers.userAgent;return/Safari/i.test(userAgent)&&!/Chrome/i.test(userAgent)}),isAndroidBrowser:function(){var version;version=helpers.androidWebkitVersion();return version&&version<537},isAndroidChrome:function(){var version;version=helpers.androidWebkitVersion();return version&&version>=537},isAndroidDevice:delurkWinPhone(function(){return/Android/.test(helpers.userAgent)}),isSupportedMobileOS:function(){return helpers.isiOS()||helpers.isAndroidDevice()},isAndroidWebapp:function(){var metaTag;if(!helpers.isAndroidChrome()){return false}metaTag=(document.getElementsByName("apple-mobile-web-app-capable")||document.getElementsByName("mobile-web-app-capable"))[0];return metaTag&&metaTag.content==="yes"},isInsideFrame:function(){return window.top!==window.self},isFallback:function(){var androidVersion,criosVersion,ffVersion,iOSVersion;if(!("postMessage"in window)||window.postMessageDisabled||document.documentMode&&document.documentMode<8){return true}androidVersion=helpers.androidVersion();if(androidVersion&&androidVersion<4){return true}iOSVersion=helpers.iOSVersion();if(iOSVersion&&iOSVersion<6){return true}ffVersion=helpers.firefoxVersion();if(ffVersion&&ffVersion<11){return true}criosVersion=helpers.iOSChromeVersion();if(criosVersion&&criosVersion<36){return true}return false},isSmallScreen:function(){return Math.min(window.screen.availHeight,window.screen.availWidth)<=640||/FakeCheckoutMobile/.test(helpers.userAgent)},pad:function(number,width,padding){var leading;if(width==null){width=2}if(padding==null){padding="0"}number=number+"";if(number.length>width){return number}leading=new Array(width-number.length+1).join(padding);return leading+number},requestAnimationFrame:function(callback){return(typeof window.requestAnimationFrame==="function"?window.requestAnimationFrame(callback):void 0)||(typeof window.webkitRequestAnimationFrame==="function"?window.webkitRequestAnimationFrame(callback):void 0)||window.setTimeout(callback,100)},requestAnimationInterval:function(func,interval){var callback,previous;previous=new Date;callback=function(){var frame,now,remaining;frame=helpers.requestAnimationFrame(callback);now=new Date;remaining=interval-(now-previous);if(remaining<=0){previous=now;func()}return frame};return callback()},getQueryParameterByName:function(name){var match;match=RegExp("[?&]"+name+"=([^&]*)").exec(window.location.search);return match&&decodeURIComponent(match[1].replace(/\+/g," "))},addQueryParameter:function(url,name,value){var hashParts,query;query=encodeURIComponent(name)+"="+encodeURIComponent(value);hashParts=new String(url).split("#");hashParts[0]+=hashParts[0].indexOf("?")!==-1?"&":"?";hashParts[0]+=query;return hashParts.join("#")},bind:function(element,name,callback){if(element.addEventListener){return element.addEventListener(name,callback,false)}else{return element.attachEvent("on"+name,callback)}},unbind:function(element,name,callback){if(element.removeEventListener){return element.removeEventListener(name,callback,false)}else{return element.detachEvent("on"+name,callback)}},host:function(url){var parent,parser;parent=document.createElement("div");parent.innerHTML='<a href="'+this.escape(url)+'">x</a>';parser=parent.firstChild;return""+parser.protocol+"//"+parser.host},strip:function(html){var tmp,_ref,_ref1;tmp=document.createElement("div");tmp.innerHTML=html;return(_ref=(_ref1=tmp.textContent)!=null?_ref1:tmp.innerText)!=null?_ref:""},setAutocomplete:function(el,type){var secureCCFill;secureCCFill=helpers.chromeVersion()>14||helpers.safariVersion()>7;if(type!=="cc-csc"&&(!/^cc-/.test(type)||secureCCFill)){el.setAttribute("x-autocompletetype",type);el.setAttribute("autocompletetype",type)}else{el.setAttribute("autocomplete","off")}if(!(type==="country-name"||type==="language"||type==="sex"||type==="gender-identity")){el.setAttribute("autocorrect","off");el.setAttribute("spellcheck","off")}if(!(/name|honorific/.test(type)||(type==="locality"||type==="city"||type==="adminstrative-area"||type==="state"||type==="province"||type==="region"||type==="language"||type==="org"||type==="organization-title"||type==="sex"||type==="gender-identity"))){return el.setAttribute("autocapitalize","off")}},hashCode:function(str){var hash,i,_i,_ref;hash=5381;for(i=_i=0,_ref=str.length;_i<_ref;i=_i+=1){hash=(hash<<5)+hash+str.charCodeAt(i)}return(hash>>>0)%65535},stripeUrlPrefix:function(){var match;match=window.location.hostname.match("^([a-z-]*)checkout.");if(match){return match[1]}else{return""}}};module.exports=helpers}).call(this)}});StripeCheckout.require.define({"lib/rpc":function(exports,require,module){(function(){var RPC,helpers,tracker,__bind=function(fn,me){return function(){return fn.apply(me,arguments)}},__slice=[].slice;helpers=require("lib/helpers");tracker=require("lib/tracker");RPC=function(){function RPC(target,options){if(options==null){options={}}this.processMessage=__bind(this.processMessage,this);this.sendMessage=__bind(this.sendMessage,this);this.invoke=__bind(this.invoke,this);this.startSession=__bind(this.startSession,this);if(options.host==null){throw new Error("Host should be provided")}this.rpcID=0;this.target=target;this.host=options.host;this.callbacks={};this.readyQueue=[];this.readyStatus=false;this.methods={};helpers.bind(window,"message",function(_this){return function(){var args;args=1<=arguments.length?__slice.call(arguments,0):[];return _this.message.apply(_this,args)}}(this))}RPC.prototype.startSession=function(){this.sendMessage("frameReady");return this.frameReady()};RPC.prototype.invoke=function(){var args,method;method=arguments[0],args=2<=arguments.length?__slice.call(arguments,1):[];tracker.trace.rpcInvoke(method);return this.ready(function(_this){return function(){return _this.sendMessage(method,args)}}(this))};RPC.prototype.message=function(e){var shouldProcess;shouldProcess=false;try{shouldProcess=e.source===this.target}catch(_error){}if(shouldProcess){return this.processMessage(e.data)}};RPC.prototype.ready=function(fn){if(this.readyStatus){return fn()}else{return this.readyQueue.push(fn)}};RPC.prototype.frameCallback=function(id,result){var _base;if(typeof(_base=this.callbacks)[id]==="function"){_base[id](result)}delete this.callbacks[id];return true};RPC.prototype.frameReady=function(){var callbacks,cb,_i,_len;this.readyStatus=true;callbacks=this.readyQueue.slice(0);for(_i=0,_len=callbacks.length;_i<_len;_i++){cb=callbacks[_i];cb()}return false};RPC.prototype.isAlive=function(){return true};RPC.prototype.sendMessage=function(method,args){var id,message;if(args==null){args=[]}id=++this.rpcID;if(typeof args[args.length-1]==="function"){this.callbacks[id]=args.pop()}message=JSON.stringify({method:method,args:args,id:id});this.target.postMessage(message,"*");return tracker.trace.rpcPostMessage(method,args,id)};RPC.prototype.processMessage=function(data){var method,result,_base,_name;try{data=JSON.parse(data)}catch(_error){return}if(["frameReady","frameCallback","isAlive"].indexOf(data.method)!==-1){result=null;method=this[data.method];if(method!=null){result=method.apply(this,data.args)}}else{result=typeof(_base=this.methods)[_name=data.method]==="function"?_base[_name].apply(_base,data.args):void 0}if(data.method!=="frameCallback"){return this.invoke("frameCallback",data.id,result)}};return RPC}();module.exports=RPC}).call(this)}});StripeCheckout.require.define({"lib/uuid":function(exports,require,module){(function(){var S4;S4=function(){return((1+Math.random())*65536|0).toString(16).substring(1)};module.exports.generate=function(){var delim;delim="-";return S4()+S4()+delim+S4()+delim+S4()+delim+S4()+delim+S4()+S4()+S4()}}).call(this)}});StripeCheckout.require.define({"lib/pixel":function(exports,require,module){(function(){var encode,generateID,getCookie,getCookieID,getLocalStorageID,request,setCookie,track;generateID=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c){var r,v;r=Math.random()*16|0;v=c==="x"?r:r&3|8;return v.toString(16)})};setCookie=function(name,value,options){var cookie,expires;if(options==null){options={}}if(options.expires===true){options.expires=-1}if(typeof options.expires==="number"){expires=new Date;expires.setTime(expires.getTime()+options.expires*24*60*60*1e3);options.expires=expires}if(options.path==null){options.path="/"}value=(value+"").replace(/[^!#-+\--:<-\[\]-~]/g,encodeURIComponent);cookie=encodeURIComponent(name)+"="+value;if(options.expires){cookie+=";expires="+options.expires.toGMTString()}if(options.path){cookie+=";path="+options.path}if(options.domain){cookie+=";domain="+options.domain}return document.cookie=cookie};getCookie=function(name){var cookie,cookies,index,key,value,_i,_len;cookies=document.cookie.split("; ");for(_i=0,_len=cookies.length;_i<_len;_i++){cookie=cookies[_i];index=cookie.indexOf("=");key=decodeURIComponent(cookie.substr(0,index));value=decodeURIComponent(cookie.substr(index+1));if(key===name){return value}}return null};encode=function(param){if(typeof param==="string"){return encodeURIComponent(param)}else{return encodeURIComponent(JSON.stringify(param))}};request=function(url,params,callback){var image,k,v;if(params==null){params={}}params.i=(new Date).getTime();params=function(){var _results;_results=[];for(k in params){v=params[k];_results.push(""+k+"="+encode(v))}return _results}().join("&");image=new Image;if(callback){image.onload=callback}image.src=""+url+"?"+params;return true};getLocalStorageID=function(){var err,lsid;if(window.navigator.doNotTrack){return"DNT"}try{lsid=localStorage.getItem("lsid");if(!lsid){lsid=generateID();localStorage.setItem("lsid",lsid)}return lsid}catch(_error){err=_error;return"NA"}};getCookieID=function(){var id;if(window.navigator.doNotTrack){return"DNT"}id=getCookie("cid")||generateID();setCookie("cid",id,{expires:360*20,domain:".stripe.com"});return id};track=function(event,params,callback){var k,referrer,request_params,search,v;if(params==null){params={}}referrer=document.referrer;search=window.location.search;request_params={event:event,rf:referrer,sc:search};for(k in params){v=params[k];request_params[k]=v}request_params.lsid||(request_params.lsid=getLocalStorageID());request_params.cid||(request_params.cid=getCookieID());return request("https://q.stripe.com",request_params,callback)};module.exports.track=track;module.exports.getLocalStorageID=getLocalStorageID;module.exports.getCookieID=getCookieID}).call(this)}});StripeCheckout.require.define({"vendor/base64":function(exports,require,module){var utf8Encode=function(string){string=(string+"").replace(/\r\n/g,"\n").replace(/\r/g,"\n");var utftext="",start,end;var stringl=0,n;start=end=0;stringl=string.length;for(n=0;n<stringl;n++){var c1=string.charCodeAt(n);var enc=null;if(c1<128){end++}else if(c1>127&&c1<2048){enc=String.fromCharCode(c1>>6|192,c1&63|128)}else{enc=String.fromCharCode(c1>>12|224,c1>>6&63|128,c1&63|128)}if(enc!==null){if(end>start){utftext+=string.substring(start,end)}utftext+=enc;start=end=n+1}}if(end>start){utftext+=string.substring(start,string.length)}return utftext};module.exports.encode=function(data){var b64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var o1,o2,o3,h1,h2,h3,h4,bits,i=0,ac=0,enc="",tmp_arr=[];if(!data){return data}data=utf8Encode(data);do{o1=data.charCodeAt(i++);o2=data.charCodeAt(i++);o3=data.charCodeAt(i++);bits=o1<<16|o2<<8|o3;h1=bits>>18&63;h2=bits>>12&63;h3=bits>>6&63;h4=bits&63;tmp_arr[ac++]=b64.charAt(h1)+b64.charAt(h2)+b64.charAt(h3)+b64.charAt(h4)}while(i<data.length);enc=tmp_arr.join("");switch(data.length%3){case 1:enc=enc.slice(0,-2)+"==";break;case 2:enc=enc.slice(0,-1)+"=";break}return enc}}});StripeCheckout.require.define({"lib/tracker":function(exports,require,module){(function(){var base64,config,isEventNameExisting,mixpanel,pixel,stateParameters,trace,traceSerialize,track,tracker,uuid,__indexOf=[].indexOf||function(item){for(var i=0,l=this.length;i<l;i++){if(i in this&&this[i]===item)return i}return-1};uuid=require("lib/uuid");pixel=require("lib/pixel");base64=require("vendor/base64");config={enabled:false,tracingEnabled:false,eventNamePrefix:"checkout.",distinctId:uuid.generate(),mixpanelKey:null};stateParameters={};tracker={};tracker.setEnabled=function(enabled){return config.enabled=enabled};tracker.setTracingEnabled=function(enabled){return config.tracingEnabled=enabled};tracker.setMixpanelKey=function(mixpanelKey){return config.mixpanelKey=mixpanelKey};tracker.track={outerOpen:function(parameters){var requiredKeys;requiredKeys=["key"];return track("outer.open",parameters,requiredKeys,{appendStateParameters:false})},open:function(options){var k,parameters,v;parameters={};for(k in options){v=options[k];parameters["option-"+k]=v}return track("open",parameters)},close:function(parameters){return track("close",parameters,["withToken"])},rememberMe:function(parameters){return track("checkbox.rememberMe",parameters,["checked"])},authorizeAccount:function(){return track("account.authorize")},login:function(){return track("account.authorize.success")},wrongVerificationCode:function(){return track("account.authorize.fail")},keepMeLoggedIn:function(parameters){return track("checkbox.keepMeLoggedIn",parameters,["checked"])},logout:function(){return track("account.logout")},submit:function(){return track("submit")},invalid:function(parameters){if(parameters["err"]==null&&parameters["fields"]==null){throw new Error("Cannot track invalid because err or fields should be provided")}return track("invalid",parameters)},moreInfo:function(){return track("moreInfoLink.click")},accountCreateSuccess:function(){return track("account.create.success")},accountCreateFail:function(){return track("account.create.fail")},addressAutocompleteShow:function(){return track("addressAutoComplete.show")},addressAutocompleteResultSelected:function(){return track("addressAutocomplete.result.selected")},back:function(parameters){return track("back",parameters,["from_step","to_step"])},token:function(parameters){return track("token",parameters,["stripe_token"])},phoneVerificationShow:function(){return track("phoneVerification.show")},phoneVerificationCreate:function(parameters){return track("phoneVerification.create",parameters,["use_sms"])},phoneVerificationAuthorize:function(parameters){return track("fraudCodeVerification.authorize",parameters,["valid"])}};tracker.trace={trigger:function(eventName,args){var EXCLUDED_EVENTS;EXCLUDED_EVENTS=["didResize","emailValueDidChange","click","checkboxCheck","addressAutocompleteVisibilityChanged","baseInputDidChange","valueDidChange","labelWithCheckboxCheckChanged","zipCodeVisibleChanged","telInputValLengthChange","zipCodeInputDidFocus","zipCodeInputDidBlur","checkoutDidChangeHeight","viewAddedToDOM"];eventName=eventName.split(".");if(eventName[eventName.length-1]==="checkout"){eventName.pop()}eventName=eventName.join(".");if(__indexOf.call(EXCLUDED_EVENTS,eventName)<0){if(this._triggerQueue==null){this._triggerQueue={}}this._triggerQueue[eventName]=traceSerialize(args);return this._triggerTimeout!=null?this._triggerTimeout:this._triggerTimeout=setTimeout(function(_this){return function(){var _ref;_ref=_this._triggerQueue;for(eventName in _ref){args=_ref[eventName];trace("trigger."+eventName,{args:args})}_this._triggerQueue={};return _this._triggerTimeout=null}}(this),0)}},rpcInvoke:function(method){return trace("rpc.invoke."+method)},rpcPostMessage:function(method,args,id){return trace("rpc.postMessage."+method,{id:id,args:traceSerialize(args)})}};tracker.state={setUIType:function(type){return stateParameters["st-ui-type"]=type},setUIIntegration:function(integration){return stateParameters["st-ui-integration"]=integration},setAccountsEnabled:function(bool){return stateParameters["st-accounts-enabled"]=bool},setRememberMeEnabled:function(bool){return stateParameters["st-remember-me-enabled"]=bool},setRememberMeChecked:function(bool){return stateParameters["st-remember-me-checked"]=bool},setAccountCreated:function(bool){return stateParameters["st-account-created"]=bool},setLoggedIn:function(bool){return stateParameters["st-logged-in"]=bool},setVariants:function(variants){var k,v,_results;_results=[];for(k in variants){v=variants[k];_results.push(stateParameters["st-variant-"+k]=v)}return _results},setPhoneVerificationShown:function(bool){return stateParameters["st-phone-verification-shown"]=bool}};tracker.dontTrack=function(fn){var enabled;enabled=config.enabled;config.enabled=false;fn();return config.enabled=enabled};isEventNameExisting=function(eventName){var exists,k,v,_ref;exists=false;_ref=tracker.events;for(k in _ref){v=_ref[k];if(v===eventName){exists=true;break}}return exists};trace=function(eventName,parameters,requiredKeys,options){if(parameters==null){parameters={}}if(requiredKeys==null){requiredKeys=[]}if(options==null){options={}}if(!config.tracingEnabled){return}eventName="trace."+eventName;options.excludeMixpanel=true;return track.apply(this,arguments)};track=function(eventName,parameters,requiredKeys,options){var fullEventName,k,key,missingKeys,v,_i,_len;if(parameters==null){parameters={}}if(requiredKeys==null){requiredKeys=[]}if(options==null){options={}}if(!config.enabled){return}missingKeys=function(){var _i,_len,_results;_results=[];for(_i=0,_len=requiredKeys.length;_i<_len;_i++){key=requiredKeys[_i];if(!(key in parameters)){_results.push(key)}}return _results}();if(missingKeys.length>0){throw new Error("Missing required data ("+missingKeys.join(", ")+") for tracking "+eventName+".")}parameters.distinct_id=config.distinctId;if(options.appendStateParameters==null){options.appendStateParameters=true}if(options.appendStateParameters){for(k in stateParameters){v=stateParameters[k];parameters[k]=v}}parameters.h=screen.height;parameters.w=screen.width;for(v=_i=0,_len=parameters.length;_i<_len;v=++_i){k=parameters[v];if(v instanceof Array){v.sort()}}fullEventName=""+config.eventNamePrefix+eventName;if(!options.excludeMixpanel){mixpanel.track(fullEventName,parameters)}return pixel.track(fullEventName,parameters)};mixpanel={};mixpanel.track=function(eventName,options){var dataStr,properties;if(options==null){options={}}if(!(typeof $!=="undefined"&&$!==null&&config.mixpanelKey!=null)){return}properties=$.extend({token:config.mixpanelKey,userAgent:window.navigator.userAgent},options);delete properties["stripe_token"];dataStr=base64.encode(JSON.stringify({event:eventName,properties:properties}));return(new Image).src="https://api.mixpanel.com/track/?ip=1&img=1&data="+dataStr};traceSerialize=function(value){var k,obj,v;if(value instanceof Array){return JSON.stringify(function(){var _i,_len,_results;_results=[];for(_i=0,_len=value.length;_i<_len;_i++){v=value[_i];_results.push(traceSerialize(v))}return _results}())}else if(value!=null&&value.target!=null&&value.type!=null){return traceSerialize({type:value.type,target_id:value.target.id})}else if(value instanceof Object){if(value.constructor===Object){obj={};for(k in value){v=value[k];obj[k]=traceSerialize(v)}return JSON.stringify(obj)}else{return value.toString()}}else{return value}};module.exports=tracker}).call(this)}});StripeCheckout.require.define({"outer/lib/fallbackRpc":function(exports,require,module){(function(){var FallbackRPC,cacheBust,interval,lastHash,re,__bind=function(fn,me){return function(){return fn.apply(me,arguments)}};cacheBust=1;interval=null;lastHash=null;re=/^#?\d+&/;FallbackRPC=function(){function FallbackRPC(target,host){this.receiveMessage=__bind(this.receiveMessage,this);this.invokeTarget=__bind(this.invokeTarget,this);this.target=target;this.host=host}FallbackRPC.prototype.invokeTarget=function(message){var url;message=+new Date+cacheBust++ +"&"+encodeURIComponent(message);url=this.host+"";return this.target.location=url.replace(/#.*$/,"")+"#"+message};FallbackRPC.prototype.receiveMessage=function(callback,delay){if(delay==null){delay=100}interval&&clearInterval(interval);return interval=setInterval(function(){var hash;hash=decodeURIComponent(window.location.hash);if(hash!==lastHash&&re.test(hash)){window.location.hash="";lastHash=hash;return callback({data:hash.replace(re,"")})}},delay)};return FallbackRPC}();module.exports=FallbackRPC}).call(this)}});StripeCheckout.require.define({"outer/lib/utils":function(exports,require,module){(function(){var $,$$,addClass,append,css,hasAttr,hasClass,insertAfter,insertBefore,parents,remove,resolve,text,trigger,__indexOf=[].indexOf||function(item){for(var i=0,l=this.length;i<l;i++){if(i in this&&this[i]===item)return i}return-1};$=function(sel){return document.querySelectorAll(sel)};$$=function(cls){var el,reg,_i,_len,_ref,_results;if(typeof document.getElementsByClassName==="function"){return document.getElementsByClassName(cls)}else if(typeof document.querySelectorAll==="function"){return document.querySelectorAll("."+cls)}else{reg=new RegExp("(^|\\s)"+cls+"(\\s|$)");_ref=document.getElementsByTagName("*");_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++){el=_ref[_i];if(reg.test(el.className)){_results.push(el)}}return _results}};hasAttr=function(element,attr){var node;if(typeof element.hasAttribute==="function"){return element.hasAttribute(attr)}else{node=element.getAttributeNode(attr);return!!(node&&(node.specified||node.nodeValue))}};trigger=function(element,name,data,bubble){if(data==null){data={}}if(bubble==null){bubble=true}if(window.jQuery){return jQuery(element).trigger(name,data)}};addClass=function(element,name){return element.className+=" "+name};hasClass=function(element,name){return __indexOf.call(element.className.split(" "),name)>=0};css=function(element,css){return element.style.cssText+=";"+css};insertBefore=function(element,child){return element.parentNode.insertBefore(child,element)};insertAfter=function(element,child){return element.parentNode.insertBefore(child,element.nextSibling)};append=function(element,child){return element.appendChild(child)};remove=function(element){var _ref;return(_ref=element.parentNode)!=null?_ref.removeChild(element):void 0};parents=function(node){var ancestors;ancestors=[];while((node=node.parentNode)&&node!==document&&__indexOf.call(ancestors,node)<0){ancestors.push(node)}return ancestors};resolve=function(url){var parser;parser=document.createElement("a");parser.href=url;return""+parser.href};text=function(element,value){if("innerText"in element){element.innerText=value}else{element.textContent=value}return value};module.exports={$:$,$$:$$,hasAttr:hasAttr,trigger:trigger,addClass:addClass,hasClass:hasClass,css:css,insertBefore:insertBefore,insertAfter:insertAfter,append:append,remove:remove,parents:parents,resolve:resolve,text:text}
}).call(this)}});StripeCheckout.require.define({"outer/controllers/app":function(exports,require,module){(function(){var App,Checkout,RPC,tracker,utils,__bind=function(fn,me){return function(){return fn.apply(me,arguments)}};Checkout=require("outer/controllers/checkout");RPC=require("lib/rpc");tracker=require("lib/tracker");utils=require("outer/lib/utils");App=function(){function App(options){var _ref,_ref1;if(options==null){options={}}this.trackOpen=__bind(this.trackOpen,this);this.setHost=__bind(this.setHost,this);this.configure=__bind(this.configure,this);this.open=__bind(this.open,this);this.configurations={};this.checkouts={};this.host="https://checkout.stripe.com";this.timeLoaded=Math.floor((new Date).getTime()/1e3);this.totalButtons=0;if(((_ref=window.Prototype)!=null?(_ref1=_ref.Version)!=null?_ref1.indexOf("1.6"):void 0:void 0)===0){console.error("Stripe Checkout is not compatible with your version of Prototype.js. Please upgrade to version 1.7 or greater.")}}App.prototype.open=function(options,buttonId){var checkout,k,mergedOptions,v,_ref;if(buttonId==null){buttonId=null}mergedOptions={referrer:document.referrer,url:document.URL,timeLoaded:this.timeLoaded};if(buttonId&&this.configurations[buttonId]){_ref=this.configurations[buttonId];for(k in _ref){v=_ref[k];mergedOptions[k]=v}}for(k in options){v=options[k];mergedOptions[k]=v}if(mergedOptions.image){mergedOptions.image=utils.resolve(mergedOptions.image)}if(buttonId){checkout=this.checkouts[buttonId]}else{checkout=new Checkout(options.token,this.host)}this.trackOpen(checkout,mergedOptions);return checkout.open(mergedOptions)};App.prototype.configure=function(buttonId,options){if(options==null){options={}}if(buttonId instanceof Object){options=buttonId;buttonId="button"+this.totalButtons++}if(options.image){options.image=utils.resolve(options.image)}this.configurations[buttonId]=options;this.checkouts[buttonId]=new Checkout(options.token,this.host);this.checkouts[buttonId].preload(options);return{open:function(_this){return function(options){return _this.open(options,buttonId)}}(this)}};App.prototype.setHost=function(host){return this.host=host};App.prototype.trackOpen=function(checkout,options){tracker.setEnabled(!options.notrack);return tracker.track.outerOpen({key:options.key,lsid:"NA",cid:"NA"})};return App}();module.exports=App}).call(this)}});StripeCheckout.require.define({"outer/controllers/button":function(exports,require,module){(function(){var $$,Button,addClass,append,hasAttr,hasClass,helpers,insertAfter,parents,text,trigger,_ref,__bind=function(fn,me){return function(){return fn.apply(me,arguments)}};_ref=require("outer/lib/utils"),$$=_ref.$$,hasClass=_ref.hasClass,addClass=_ref.addClass,trigger=_ref.trigger,append=_ref.append,text=_ref.text,parents=_ref.parents,insertAfter=_ref.insertAfter,hasAttr=_ref.hasAttr;helpers=require("lib/helpers");Button=function(){Button.totalButtonId=0;Button.load=function(app){var button,el,element;element=$$("stripe-button");element=function(){var _i,_len,_results;_results=[];for(_i=0,_len=element.length;_i<_len;_i++){el=element[_i];if(!hasClass(el,"active")){_results.push(el)}}return _results}();element=element[element.length-1];if(!element){return}addClass(element,"active");button=new Button(element,app);return button.append()};function Button(scriptEl,app){this.parseOptions=__bind(this.parseOptions,this);this.parentHead=__bind(this.parentHead,this);this.parentForm=__bind(this.parentForm,this);this.onToken=__bind(this.onToken,this);this.open=__bind(this.open,this);this.submit=__bind(this.submit,this);this.append=__bind(this.append,this);this.render=__bind(this.render,this);var _base;this.scriptEl=scriptEl;this.app=app;this.document=this.scriptEl.ownerDocument;this.nostyle=helpers.isFallback();this.options=this.parseOptions();(_base=this.options).label||(_base.label="Pay with Card");this.options.token=this.onToken;this.$el=document.createElement("button");this.$el.setAttribute("type","submit");this.$el.className="stripe-button-el";helpers.bind(this.$el,"click",this.submit);helpers.bind(this.$el,"touchstart",function(){});this.render()}Button.prototype.render=function(){this.$el.innerHTML="";this.$span=document.createElement("span");text(this.$span,this.options.label);if(!this.nostyle){this.$el.style.visibility="hidden";this.$span.style.display="block";this.$span.style.minHeight="30px"}this.$style=document.createElement("link");this.$style.setAttribute("type","text/css");this.$style.setAttribute("rel","stylesheet");this.$style.setAttribute("href",this.app.host+"/v3/checkout/button.css");return append(this.$el,this.$span)};Button.prototype.append=function(){var head;if(this.scriptEl){insertAfter(this.scriptEl,this.$el)}if(!this.nostyle){head=this.parentHead();if(head){append(head,this.$style)}}if(this.$form=this.parentForm()){helpers.unbind(this.$form,"submit",this.submit);helpers.bind(this.$form,"submit",this.submit)}if(!this.nostyle){setTimeout(function(_this){return function(){return _this.$el.style.visibility="visible"}}(this),1e3)}this.app.setHost(helpers.host(this.scriptEl.src));return this.appHandler=this.app.configure(this.options,{form:this.$form})};Button.prototype.disable=function(){return this.$el.setAttribute("disabled",true)};Button.prototype.enable=function(){return this.$el.removeAttribute("disabled")};Button.prototype.isDisabled=function(){return hasAttr(this.$el,"disabled")};Button.prototype.submit=function(e){if(typeof e.preventDefault==="function"){e.preventDefault()}if(!this.isDisabled()){this.open()}return false};Button.prototype.open=function(){return this.appHandler.open(this.options)};Button.prototype.onToken=function(token,args){var $input,$tokenInput,$tokenTypeInput,key,value;trigger(this.scriptEl,"token",token);if(this.$form){$tokenInput=this.renderInput("stripeToken",token.id);append(this.$form,$tokenInput);$tokenTypeInput=this.renderInput("stripeTokenType",token.type);append(this.$form,$tokenTypeInput);if(token.email){append(this.$form,this.renderInput("stripeEmail",token.email))}if(args){for(key in args){value=args[key];$input=this.renderInput(this.formatKey(key),value);append(this.$form,$input)}}this.$form.submit()}return this.disable()};Button.prototype.formatKey=function(key){var arg,args,_i,_len;args=key.split("_");key="";for(_i=0,_len=args.length;_i<_len;_i++){arg=args[_i];if(arg.length>0){key=key+arg.substr(0,1).toUpperCase()+arg.substr(1).toLowerCase()}}return"stripe"+key};Button.prototype.renderInput=function(name,value){var input;input=document.createElement("input");input.type="hidden";input.name=name;input.value=value;return input};Button.prototype.parentForm=function(){var el,elements,_i,_len,_ref1;elements=parents(this.$el);for(_i=0,_len=elements.length;_i<_len;_i++){el=elements[_i];if(((_ref1=el.tagName)!=null?_ref1.toLowerCase():void 0)==="form"){return el}}return null};Button.prototype.parentHead=function(){var _ref1,_ref2;return((_ref1=this.document)!=null?_ref1.head:void 0)||((_ref2=this.document)!=null?_ref2.getElementsByTagName("head")[0]:void 0)||this.document.body};Button.prototype.parseOptions=function(){var attr,match,options,_i,_len,_ref1;options={};_ref1=this.scriptEl.attributes;for(_i=0,_len=_ref1.length;_i<_len;_i++){attr=_ref1[_i];match=attr.name.match(/^data-(.+)$/);if(match!=null?match[1]:void 0){options[match[1]]=attr.value}}return options};return Button}();module.exports=Button}).call(this)}});StripeCheckout.require.define({"outer/controllers/checkout":function(exports,require,module){(function(){var Checkout,FallbackView,IframeView,TabView,cookie,helpers,__bind=function(fn,me){return function(){return fn.apply(me,arguments)}};helpers=require("lib/helpers");IframeView=require("outer/views/iframeView");TabView=require("outer/views/tabView");FallbackView=require("outer/views/fallbackView");cookie=require("vendor/cookie");Checkout=function(){Checkout.activeView=null;function Checkout(onToken,host){this.preload=__bind(this.preload,this);this.open=__bind(this.open,this);var path,shouldPopup,viewClass;this.onToken=onToken;this.host=host;this.onToken=function(data){return onToken(data.token,data.args)};if(helpers.isFallback()){viewClass=FallbackView;path="/v3/fallback"}else{path="/v3";shouldPopup=helpers.isSupportedMobileOS()&&!(helpers.isiOSWebView()||helpers.isAndroidWebapp());if(!shouldPopup){viewClass=IframeView}else{viewClass=TabView}}this.view=new viewClass(this.onToken,this.host,path)}Checkout.prototype.open=function(options){if(options==null){options={}}if(Checkout.activeView&&Checkout.activeView!==this.view){Checkout.activeView.close()}Checkout.activeView=this.view;return this.view.open(options,function(_this){return function(status){if(status){return}if(!(_this.view instanceof TabView)){return}_this.view=new IframeView(_this.onToken,_this.host,"/v3");return _this.open(options)}}(this))};Checkout.prototype.preload=function(options){return this.view.preload(options)};return Checkout}();module.exports=Checkout}).call(this)}});StripeCheckout.require.define({"outer/views/fallbackView":function(exports,require,module){(function(){var FallbackRPC,FallbackView,View,__bind=function(fn,me){return function(){return fn.apply(me,arguments)}},__hasProp={}.hasOwnProperty,__extends=function(child,parent){for(var key in parent){if(__hasProp.call(parent,key))child[key]=parent[key]}function ctor(){this.constructor=child}ctor.prototype=parent.prototype;child.prototype=new ctor;child.__super__=parent.prototype;return child};FallbackRPC=require("outer/lib/fallbackRpc");View=require("outer/views/view");FallbackView=function(_super){__extends(FallbackView,_super);function FallbackView(){this.close=__bind(this.close,this);this.open=__bind(this.open,this);FallbackView.__super__.constructor.apply(this,arguments)}FallbackView.prototype.open=function(options,callback){var message,url;FallbackView.__super__.open.apply(this,arguments);url=this.host+this.path;this.frame=window.open(url,"stripe_checkout_app","width=400,height=400,location=yes,resizable=yes,scrollbars=yes");if(this.frame==null){alert("Disable your popup blocker to proceed with checkout.");url="https://stripe.com/docs/checkout#integration-more-runloop";throw new Error("To learn how to prevent the Stripe Checkout popup from being blocked, please visit "+url)}this.rpc=new FallbackRPC(this.frame,url);this.rpc.receiveMessage(function(_this){return function(e){var data;try{data=JSON.parse(e.data)}catch(_error){return}return _this.onToken(data)}}(this));message=JSON.stringify(this.options);this.rpc.invokeTarget(message);return callback(true)};FallbackView.prototype.close=function(){var _ref;return(_ref=this.frame)!=null?_ref.close():void 0};return FallbackView}(View);module.exports=FallbackView}).call(this)}});StripeCheckout.require.define({"outer/views/iframeView":function(exports,require,module){(function(){var IframeView,RPC,View,helpers,ready,utils,__bind=function(fn,me){return function(){return fn.apply(me,arguments)}},__hasProp={}.hasOwnProperty,__extends=function(child,parent){for(var key in parent){if(__hasProp.call(parent,key))child[key]=parent[key]}function ctor(){this.constructor=child}ctor.prototype=parent.prototype;child.prototype=new ctor;child.__super__=parent.prototype;return child};utils=require("outer/lib/utils");helpers=require("lib/helpers");RPC=require("lib/rpc");View=require("outer/views/view");ready=require("vendor/ready");IframeView=function(_super){__extends(IframeView,_super);function IframeView(){this.configure=__bind(this.configure,this);this.removeFrame=__bind(this.removeFrame,this);this.removeTouchOverlay=__bind(this.removeTouchOverlay,this);this.showTouchOverlay=__bind(this.showTouchOverlay,this);this.attachIframe=__bind(this.attachIframe,this);this.setToken=__bind(this.setToken,this);this.closed=__bind(this.closed,this);this.iframeWidth=__bind(this.iframeWidth,this);this.preload=__bind(this.preload,this);this.open=__bind(this.open,this);return IframeView.__super__.constructor.apply(this,arguments)}IframeView.prototype.open=function(options,callback){IframeView.__super__.open.apply(this,arguments);return ready(function(_this){return function(){var left,loaded;_this.originalOverflowValue=document.body.style.overflow;if(_this.frame==null){_this.configure()}_this.frame.style.display="block";if(_this.shouldShowTouchOverlay()){_this.showTouchOverlay();_this.frame.style.top=(window.scrollY||window.pageYOffset)+"px";left=(window.scrollX||window.pageXOffset)+(window.innerWidth-_this.iframeWidth())/2;left=Math.min(window.innerWidth-_this.iframeWidth(),Math.max(0,left));left=Math.max(0,left);_this.frame.style.left=left+"px"}loaded=false;setTimeout(function(){if(loaded){return}loaded=true;callback(false);return _this.removeFrame()},8e3);return _this.rpc.ready(function(){if(loaded){return}loaded=true;callback(true);_this.rpc.invoke("render","","iframe",_this.options);document.body.style.overflow="hidden";return _this.rpc.invoke("open",{timeLoaded:_this.options.timeLoaded},function(success){var _base;if(success){return typeof(_base=_this.options).opened==="function"?_base.opened():void 0}})})}}(this))};IframeView.prototype.preload=function(options){return ready(function(_this){return function(){_this.configure();return _this.rpc.invoke("preload",options)}}(this))};IframeView.prototype.iframeWidth=function(){if(helpers.isSmallScreen()){return 320}else{return 380}};IframeView.prototype.closed=function(){var _base;document.body.style.overflow=this.originalOverflowValue;this.removeFrame();if(typeof(_base=this.options).closed==="function"){_base.closed()}clearTimeout(this.tokenTimeout);if(this.token!=null){this.onToken(this.token)}this.token=null;this.configure();this.preload(this.options);return true};IframeView.prototype.setToken=function(data){this.token=data;return this.tokenTimeout!=null?this.tokenTimeout:this.tokenTimeout=setTimeout(function(_this){return function(){_this.onToken(_this.token);_this.tokenTimeout=null;return _this.token=null}}(this),2500)};IframeView.prototype.attachIframe=function(){var cssText,iframe;iframe=document.createElement("iframe");iframe.setAttribute("frameBorder","0");iframe.setAttribute("allowtransparency","true");cssText="z-index: 9999;\ndisplay: none;\nbackground: transparent;\nbackground: rgba(0,0,0,0.005);\nborder: 0px none transparent;\noverflow-x: hidden;\noverflow-y: auto;\nvisibility: hidden;\nmargin: 0;\npadding: 0;\n-webkit-tap-highlight-color: transparent;\n-webkit-touch-callout: none;";if(this.shouldShowTouchOverlay()){cssText+="position: absolute;\nwidth: "+this.iframeWidth()+"px;\nheight: 1000px;"}else{cssText+="position: fixed;\nleft: 0;\ntop: 0;\nwidth: 100%;\nheight: 100%;"}iframe.style.cssText=cssText;helpers.bind(iframe,"load",function(_this){return function(){return iframe.style.visibility="visible"}}(this));iframe.src=this.host+this.path;iframe.className=iframe.name="stripe_checkout_app";utils.append(document.body,iframe);return iframe};IframeView.prototype.showTouchOverlay=function(){var toRepaint;if(this.overlay){return}this.overlay=document.createElement("div");this.overlay.style.cssText="z-index: 9998;\nbackground: #000;\nopacity: 0;\nborder: 0px none transparent;\noverflow: none;\nmargin: 0;\npadding: 0;\n-webkit-tap-highlight-color: transparent;\n-webkit-touch-callout: none;\nposition: fixed;\nleft: 0;\ntop: 0;\nwidth: 200%;\nheight: 200%;\ntransition: opacity 320ms ease;\n-webkit-transition: opacity 320ms ease;\n-moz-transition: opacity 320ms ease;\n-ms-transition: opacity 320ms ease;";utils.append(document.body,this.overlay);toRepaint=this.overlay.offsetHeight;return this.overlay.style.opacity="0.5"};IframeView.prototype.removeTouchOverlay=function(){var overlay;if(!this.overlay){return}overlay=this.overlay;overlay.style.opacity="0";setTimeout(function(){return utils.remove(overlay)},400);return this.overlay=null};IframeView.prototype.removeFrame=function(){var frame;if(this.shouldShowTouchOverlay()){this.removeTouchOverlay()}frame=this.frame;setTimeout(function(){return utils.remove(frame)},500);return this.frame=null};IframeView.prototype.configure=function(){if(this.frame!=null){this.removeFrame()}this.frame=this.attachIframe();this.rpc=new RPC(this.frame.contentWindow,{host:this.host});this.rpc.methods.closed=this.closed;return this.rpc.methods.setToken=this.setToken};IframeView.prototype.shouldShowTouchOverlay=function(){return helpers.isSupportedMobileOS()};return IframeView}(View);module.exports=IframeView}).call(this)}});StripeCheckout.require.define({"outer/views/tabView":function(exports,require,module){(function(){var RPC,TabView,View,helpers,__bind=function(fn,me){return function(){return fn.apply(me,arguments)}},__hasProp={}.hasOwnProperty,__extends=function(child,parent){for(var key in parent){if(__hasProp.call(parent,key))child[key]=parent[key]}function ctor(){this.constructor=child}ctor.prototype=parent.prototype;child.prototype=new ctor;child.__super__=parent.prototype;return child};RPC=require("lib/rpc");helpers=require("lib/helpers");View=require("outer/views/view");TabView=function(_super){__extends(TabView,_super);function TabView(){this.closed=__bind(this.closed,this);this.checkForClosedTab=__bind(this.checkForClosedTab,this);this.setToken=__bind(this.setToken,this);this.fullPath=__bind(this.fullPath,this);this.close=__bind(this.close,this);this.open=__bind(this.open,this);TabView.__super__.constructor.apply(this,arguments);this.closedTabInterval=null;this.color=null;this.colorSet=false}TabView.prototype.open=function(options,callback){var targetName,url,_base,_base1,_ref;TabView.__super__.open.apply(this,arguments);if((_ref=this.frame)!=null?_ref.opener:void 0){if(typeof(_base=this.frame).focus==="function"){_base.focus()}return}if(helpers.isiOSChrome()){targetName="_blank"}else{targetName="stripe_checkout_tabview"}this.frame=window.open(this.fullPath(),targetName);if(this.frame==null){window.alert("Disable your popup blocker to proceed with checkout.");url="https://stripe.com/docs/checkout#integration-more-runloop";throw new Error("To learn how to prevent the Stripe Checkout popup from being blocked, please visit "+url)}if(typeof(_base1=this.frame).focus==="function"){_base1.focus()}if(!this.frame||this.frame===window){this.close();callback(false);return}this.rpc=new RPC(this.frame,{host:this.host});this.rpc.methods.setToken=this.setToken;this.rpc.methods.closed=this.closed;return this.rpc.ready(function(_this){return function(){var _base2;callback(true);_this.rpc.invoke("render","","tab",_this.options);_this.rpc.invoke("open");if(typeof(_base2=_this.options).opened==="function"){_base2.opened()}return _this.checkForClosedTab()}}(this))};TabView.prototype.close=function(){if(this.frame&&this.frame!==window){return this.frame.close()}};TabView.prototype.fullPath=function(){return this.host+this.path};TabView.prototype.setToken=function(data){this.token=data;return this.tokenTimeout!=null?this.tokenTimeout:this.tokenTimeout=setTimeout(function(_this){return function(){_this.onToken(_this.token);_this.tokenTimeout=null;return _this.token=null}}(this),2500)};TabView.prototype.checkForClosedTab=function(){if(this.closedTabInterval){clearInterval(this.closedTabInterval)}return this.closedTabInterval=setInterval(function(_this){return function(){if(!_this.frame||!_this.frame.postMessage||_this.frame.closed){return _this.closed()}}}(this),100)};TabView.prototype.closed=function(){var _base;clearInterval(this.closedTabInterval);if(typeof(_base=this.options).closed==="function"){_base.closed()}clearTimeout(this.tokenTimeout);if(this.token!=null){return this.onToken(this.token)}};return TabView}(View);module.exports=TabView}).call(this)}});StripeCheckout.require.define({"outer/views/view":function(exports,require,module){(function(){var View,__bind=function(fn,me){return function(){return fn.apply(me,arguments)}};View=function(){function View(onToken,host,path){this.preload=__bind(this.preload,this);this.close=__bind(this.close,this);this.open=__bind(this.open,this);this.onToken=onToken;this.host=host;this.path=path}View.prototype.open=function(options,callback){return this.options=options};View.prototype.close=function(){};View.prototype.preload=function(options){};return View}();module.exports=View}).call(this)}});(function(){var App,Button,app,require,_ref,_ref1;require=require||this.StripeCheckout.require;Button=require("outer/controllers/button");App=require("outer/controllers/app");if(((_ref=this.StripeCheckout)!=null?_ref.__app:void 0)==null){this.StripeCheckout||(this.StripeCheckout={});this.StripeCheckout.__app=app=new App;this.StripeCheckout.open=app.open;this.StripeCheckout.configure=app.configure;this.StripeButton=this.StripeCheckout;if(((_ref1=this.StripeCheckout)!=null?_ref1.__host:void 0)&&this.StripeCheckout.__host!==""){app.setHost(this.StripeCheckout.__host)}}Button.load(this.StripeCheckout.__app)}).call(this);
//# sourceMappingURL=https://sourcemaps.stripe.com/checkout/checkout.js.map