(function($) {
  var jqRating, pluginName;
  pluginName = 'jqRating';
  jqRating = (function() {
    function jqRating(item, options) {
      this.$this = $(item);
      this.settings = {
        value: 3.5,
        retainValue: null,
        levelsClasses: ['level-xlow', 'level-low', 'level-medium', 'level-high', 'level-xhigh'],
        updateOn: 'click',
        starsCount: 5,
        basedOn: 5,
        iconClass: 'fa fa-star',
        editable: false,
        onChange: null
      };
      this.$refs = {
        starsContainer: null,
        base: null,
        hover: null,
        grade: null,
        starsBase: null,
        starsHover: null
      };
      this.levelClass = null;
      this.hoverValue = null;
      this.retainValue = null;
      this._init(options);
    }


    /*
    		 * Init
     */

    jqRating.prototype._init = function(options) {
      this._extendSettings(options);
      this.retainValue = this.settings.retainValue;
      this.$refs.starsContainer = this.$this.find('[data-jq-rating-stars]:first');
      if (!this.$refs.starsContainer.length) {
        this.$refs.starsContainer = this.$this;
      }
      this.$refs.grade = this.$this.find('[data-jq-rating-grade]');
      this._generateHtml();
      this._applyBaseCss();
      this._addEventsListeners();
      return this.setValue(this.settings.value);
    };


    /*
    		 * Destroy
     */

    jqRating.prototype.destroy = function() {
      this.$refs.starsBase.unbind('mouseover');
      this.$refs.starsBase.unbind('click');
      this.$refs.starsContainer.unbind('mouseleave');
      this.$refs.starsContainer.empty();
      this.$refs.starsContainer = null;
      this.$refs.base = null;
      this.$refs.hover = null;
      this.$refs.grade = null;
      this.$refs.starsBase = null;
      this.$refs.starsHover = null;
      this.$refs.formField = null;
      this.$this.removeClass('jq-rating');
      if (this.levelClass) {
        this.$this.removeClass(this.levelClass);
      }
      if (this.isEditable()) {
        return this.$this.removeClass('jq-rating--editable');
      }
    };


    /*
    		 * Update
     */

    jqRating.prototype.update = function() {
      this.destroy();
      return this._init();
    };


    /*
    		 * Retain to a certain value
     */

    jqRating.prototype.retain = function(value) {
      this.retainValue = value;
      return this.render();
    };


    /*
    		 * Release
     */

    jqRating.prototype.release = function() {
      if (typeof this.retainValue === !'number' || typeof this.retainValue === !'string') {
        return;
      }
      this.retainValue = null;
      return this.render();
    };


    /*
    		 * Generate html
     */

    jqRating.prototype._generateHtml = function() {
      var i, stars, _i, _ref;
      this.$this.addClass('jq-rating');
      if (this.isEditable()) {
        this.$this.addClass('jq-rating--editable');
      }
      this.$refs.base = $('<span class="jq-rating-group" />');
      this.$refs.hover = $('<span class="jq-rating-group--hover" />');
      stars = [];
      for (i = _i = 0, _ref = this.settings.starsCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        stars.push(['<span class="jq-rating-star">', '<i class="' + this.settings.iconClass + '"></i>', '</span>'].join(''));
      }
      this.$refs.starsContainer.append(this.$refs.base).append(this.$refs.hover);
      this.$refs.base.append($(stars.join('')));
      this.$refs.hover.append($(stars.join('')));
      this.$refs.starsBase = this.$refs.base.children();
      return this.$refs.starsHover = this.$refs.hover.children();
    };


    /*
    		 * Apply base css
     */

    jqRating.prototype._applyBaseCss = function() {
      if (this.$refs.starsContainer.length) {
        this.$refs.starsContainer.css({
          position: 'relative',
          display: 'inline-block'
        });
      }
      this.$refs.base.css({
        top: 0,
        left: 0
      });
      this.$refs.hover.css({
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
        'white-space': 'nowrap',
        'pointer-events': 'none'
      });
      this.$refs.starsBase.css({
        display: 'inline-block'
      });
      return this.$refs.starsHover.css({
        display: 'inline-block'
      });
    };


    /*
    		 * Add events listeners
     */

    jqRating.prototype._addEventsListeners = function() {
      this.$this.find('input[data-jq-rating-grade], textarea[data-jq-rating-grade]').on('change', (function(_this) {
        return function(e) {
          var value;
          value = parseInt(e.currentTarget.value);
          if (value < 0) {
            value = 0;
          }
          if (value > _this.settings.basedOn) {
            value = _this.settings.basedOn;
          }
          return _this.setValue(value);
        };
      })(this));
      if (this.isEditable()) {
        this.$refs.starsBase.bind('mouseover', (function(_this) {
          return function(e) {
            var index, value;
            index = $(e.currentTarget).index() + 1;
            value = _this.settings.basedOn / _this.settings.starsCount * index;
            if (_this.settings.updateOn === 'hover') {
              return _this.setValue(value);
            } else {
              _this.hoverValue = value;
              return _this.render();
            }
          };
        })(this));
        this.$refs.starsBase.bind('click', (function(_this) {
          return function(e) {
            var index;
            index = $(e.currentTarget).index() + 1;
            return _this.setValue(_this.settings.basedOn / _this.settings.starsCount * index);
          };
        })(this));
        return this.$refs.starsContainer.bind('mouseleave', (function(_this) {
          return function(e) {
            _this.hoverValue = null;
            return _this.render();
          };
        })(this));
      }
    };


    /*
    		 * Set the rating value
     */

    jqRating.prototype.setValue = function(value) {
      this.value = value;
      this.render();
      this.$refs.grade.each((function(_this) {
        return function(index, elm) {
          switch (elm.nodeName.toLowerCase()) {
            case 'textarea':
            case 'input':
              return $(elm).val(_this.value);
            default:
              return $(elm).html(_this.value);
          }
        };
      })(this));
      if (this.settings.onChange) {
        this.settings.onChange(this.value, this);
      }
      return this.$this.trigger('jqRating.change');
    };


    /*
    		 * Render
     */

    jqRating.prototype.render = function() {
      var levelClassIdx, value, width;
      value = this.hoverValue || this.value;
      if (typeof this.retainValue === 'number' || typeof this.retainValue === 'string') {
        value = this.retainValue;
      }
      width = 100 / this.settings.basedOn * value;
      this.$refs.hover.css({
        width: width + '%'
      });
      levelClassIdx = Math.round((this.settings.levelsClasses.length / this.settings.basedOn * value) - 1);
      if (levelClassIdx < 0) {
        levelClassIdx = 0;
      }
      if (levelClassIdx >= this.settings.levelsClasses.length) {
        levelClassIdx = this.settings.levelsClasses.length - 1;
      }
      if (this.levelClass) {
        this.$this.removeClass(this.levelClass);
      }
      this.levelClass = 'jq-rating--' + this.settings.levelsClasses[levelClassIdx];
      return this.$this.addClass(this.levelClass);
    };


    /*
    		 * Check if is editable or not
     */

    jqRating.prototype.isEditable = function() {
      var editable;
      editable = this.settings.editable && this.settings.editable === 'true';
      return editable;
    };


    /*
    		 * Extend settings
     */

    jqRating.prototype._extendSettings = function(options) {
      if (options != null) {
        this.settings = $.extend(this.settings, options, true);
      }
      return $.each(this.$this.get(0).attributes, (function(_this) {
        return function(index, attr) {
          var name;
          name = attr.name;
          name = name.substr('data-jq-rating-'.length);
          name = name.replace(/-([a-z])/g, function(g) {
            return g[1].toUpperCase();
          });
          if (!name) {
            return;
          }
          if (_this.settings[name] !== void 0) {
            return _this.settings[name] = attr.value;
          }
        };
      })(this));
    };

    return jqRating;

  })();

  /*
  	 * jQuery controller :
   */
  return $.fn.jqRating = function(method) {
    var args;
    if (jqRating.prototype[method]) {
      args = Array.prototype.slice.call(arguments, 1);
      return this.each(function() {
        var plugin;
        plugin = $(this).data(pluginName + '_api');
        return plugin[method].apply(plugin, args);
      });
    } else if (typeof method === 'object' || !method) {
      args = Array.prototype.slice.call(arguments);
      return this.each(function() {
        var $this, plugin;
        $this = $(this);
        if (($this.data(pluginName + '_api') != null) && $this.data(pluginName + '_api') !== '') {
          return;
        }
        plugin = new jqRating(this, args[0]);
        return $(this).data(pluginName + '_api', plugin);
      });
    } else {
      return $.error('Method ' + method + ' does not exist on jQuery.jqRating');
    }
  };
})(jQuery);

//# sourceMappingURL=jq-rating.js.map
