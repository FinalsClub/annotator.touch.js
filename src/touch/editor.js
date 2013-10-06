// Generated by CoffeeScript 1.6.3
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Annotator.Plugin.Touch.Editor = (function(_super) {
  var Touch, jQuery, _t;

  __extends(Editor, _super);

  _t = Annotator._t;

  jQuery = Annotator.$;

  Touch = Annotator.Plugin.Touch;

  Editor.prototype.events = {
    "click": "_onOverlayTap",
    ".annotator-quote-toggle tap": "_onExpandTap"
  };

  Editor.prototype.classes = {
    expand: "annotator-touch-expand"
  };

  Editor.prototype.template = Handlebars.compile("<div class=\"large-12 columns\">\n  <div class=\"row note-section\">\n    <div class=\"small-12 columns\">\n      <p class=\"dialog-edit-note-text\">Note</p>\n      <textarea class=\"highlight-detail-note-text-edit\" id=\"text\">\n        {{{text}}}\n      </textarea>\n    </div>\n  </div>\n  <!--END Edit annotation textarea-->\n\n  <div class=\"dialog-rule\"></div>\n\n  <!--BEGIN Edit annotation metadata-->\n\n  <div class=\"row note-section dialog-edit-note-meta-row\">\n    <div class=\"small-2 columns\">\n      <p class=\"dialog-edit-note-text\">\n        Tags\n      </p>\n    </div>\n\n    <div class=\"small-10 columns\">\n      <input class=\"highlight-detail-note-text edit-detail-note-form\" value=\"\">\n    </div>\n  </div>\n\n  <div class=\"dialog-rule\"></div>\n\n  <div class=\"row note-section dialog-edit-note-meta-row\">\n    <div class=\"small-2 columns\">\n      <p class=\"dialog-edit-note-text\">\n        Folders\n      </p>\n    </div>\n\n    <div class=\"small-10 columns\">\n      <p class=\"highlight-detail-note-text\"></p>\n    </div>\n  </div>\n  <div class=\"row gray-background\">\n    <div class=\"large-12 columns\">\n      <div class=\"row\">\n        <div class=\"large-8 large-offset-2 columns highlight-view-container\">\n          <p class=\"highlight-detail-highlighted-text vertical-color-1\">\n            {{{quote}}}\n          </p>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"row note-metadata-container\">\n    <div class=\"large-12 columns\">\n      <div class=\"row\">\n        <div class=\"small-6 columns\">\n          <div class=\"done-button-container annotator-save\" >\n            <a class=\"done-button-black button\">SAVE</a>\n          </div>\n        </div>\n\n        <div class=\"small-6 columns\">\n          <div class=\"delete-button-container annotator-cancel\" >\n            <a class=\"done-button-black button\">CANCEL</a>\n          </div>\n        </div>\n\n      </div>\n    </div>\n  </div>\n</div>");

  function Editor(editor, options) {
    this.editor = editor;
    this._onOverlayTap = __bind(this._onOverlayTap, this);
    this._onCancel = __bind(this._onCancel, this);
    this._onSubmit = __bind(this._onSubmit, this);
    this._onExpandTap = __bind(this._onExpandTap, this);
    this._triggerAndroidRedraw = __bind(this._triggerAndroidRedraw, this);
    Editor.__super__.constructor.call(this, this.editor.element[0], options);
    this.editor.hide = function() {};
    this.editor.show = function() {
      return this.publish('show');
    };
    this.element.remove();
    this.element = $('.sidebar');
    console.log(this.element);
  }

  Editor.prototype.delegateUiEvents = function() {
    $('.annotator-cancel').on('tap', this._onCancel);
    return $('.annotator-save').on('tap', this._onSubmit);
  };

  Editor.prototype.load = function() {
    console.log("editor load", this.element);
    this.element = $('.sidebar');
    this.element.empty();
    this.element.html(this.template(this.annotation[0]));
    if (!this.first) {
      this.delegateUiEvents();
    }
    return this.first = true;
  };

  Editor.prototype.setAnnotation = function(annotations) {
    return this.annotation = annotations;
  };

  Editor.prototype.showQuote = function() {
    this.quote.addClass(this.classes.expand);
    this.quote.find("button").text(_t("Collapse"));
    return this;
  };

  Editor.prototype.hideQuote = function() {
    this.quote.removeClass(this.classes.expand);
    this.quote.find("button").text(_t("Expand"));
    return this;
  };

  Editor.prototype.isQuoteHidden = function() {
    return !this.quote.hasClass(this.classes.expand);
  };

  Editor.prototype._setupQuoteField = function() {
    var _this = this;
    this.quote = jQuery(this.editor.addField({
      id: 'quote',
      load: function(field, annotation) {
        _this.hideQuote();
        _this.quote.find('span').html(Annotator.Util.escape(annotation.quote || ''));
        return _this.quote.find("button").toggle(_this._isTruncated());
      }
    }));
    this.quote.empty().addClass("annotator-item-quote");
    return this.quote.append(this.templates.quote);
  };

  Editor.prototype._setupAndroidRedrawHack = function() {
    var check, timer,
      _this = this;
    if (Touch.isAndroid()) {
      timer = null;
      check = function() {
        timer = null;
        return _this._triggerAndroidRedraw();
      };
      return jQuery(window).bind("scroll", function() {
        if (!timer) {
          return timer = setTimeout(check, 100);
        }
      });
    }
  };

  Editor.prototype._triggerAndroidRedraw = function() {
    if (!this._input) {
      this._input = this.element.find(":input:first");
    }
    if (!this._default) {
      this._default = parseFloat(this._input.css("padding-top"));
    }
    this._multiplier = (this._multiplier || 1) * -1;
    this._input[0].style.paddingTop = (this._default + this._multiplier) + "px";
    return this._input[0].style.paddingTop = (this._default - this._multiplier) + "px";
  };

  Editor.prototype._isTruncated = function() {
    var expandedHeight, isHidden, truncatedHeight;
    isHidden = this.isQuoteHidden();
    if (!isHidden) {
      this.hideQuote();
    }
    truncatedHeight = this.quote.height();
    this.showQuote();
    expandedHeight = this.quote.height();
    if (isHidden) {
      this.hideQuote();
    } else {
      this.showQuote();
    }
    return expandedHeight > truncatedHeight;
  };

  Editor.prototype._onExpandTap = function(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.isQuoteHidden()) {
      return this.showQuote();
    } else {
      return this.hideQuote();
    }
  };

  Editor.prototype._onSubmit = function(event) {
    var text;
    console.log('_onSubmit');
    text = $('#text').val();
    this.annotation[0].text = text;
    this.editor.publish('save', [this.annotation]);
    return $('body').toggleClass('active');
  };

  Editor.prototype._onCancel = function(event) {
    console.log('_onCancel');
    return $('body').toggleClass('active');
  };

  Editor.prototype._onOverlayTap = function(event) {
    if (event.target === this.element[0]) {
      return this.editor.hide();
    }
  };

  return Editor;

})(Annotator.Delegator);
