// Generated by CoffeeScript 1.6.3
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Annotator.Plugin.Touch.Viewer = (function(_super) {
  var jQuery;

  __extends(Viewer, _super);

  jQuery = Annotator.$;

  Viewer.prototype.events = {
    ".annotator-item tap": "_onTap",
    ".annotator-edit tap": "_onEdit",
    ".annotator-delete tap": "_onDelete",
    ".done-button-container tap": "_onDone",
    ".done-button-container click": "_onDone"
  };

  function Viewer(viewer, editor, options) {
    this.viewer = viewer;
    this.editor = editor;
    this._onLoad = __bind(this._onLoad, this);
    Viewer.__super__.constructor.call(this, this.viewer.element[0], options);
    this.element.unbind("click");
    this.viewer.hide = function() {};
    this.viewer.show = function() {};
    this.element.addClass('row');
    this.element.removeClass("annotator-hide annotator-outer annotator-viewer");
    this.element.attr('role', 'complimentary');
    this.element.attr('id', 'sidebar');
    this.on("load", this._onLoad);
  }

  Viewer.prototype.load = function(annotations) {
    this.element.empty();
    this.currentAnnotation = annotations;
    this.element.html(this.template(annotations[0]));
    return $('body').toggleClass('active');
  };

  Viewer.prototype.template = Handlebars.compile("<div class=\"large-12 columns\">\n\n  <!--BEGIN the text from the document that has been highlighted by the user-->\n  <div class=\"row gray-background\">\n    <div class=\"large-8 large-offset-2 columns highlight-view-container\">\n      <p class=\"highlight-detail-highlighted-text vertical-color-1\">{{{quote}}}</p>\n\n    </div>\n\n  </div>\n\n  <!--END the text from the document that has been highlighted by the user-->\n\n  <!--BEGIN the text of the annotation-->\n\n  <div class=\"row note-section\">\n    <div class=\"large-8 large-offset-2 columns highlight-note-container\">\n      <p class=\"note-detail-header\">\n      NOTE\n      </p>\n      <p class=\"highlight-detail-note-text-2\">{{{text}}}\n      </p>\n    </div>\n  </div>\n\n  <!--END the text of the annotation-->\n\n  <!--BEGIN the tags and folders block-->\n\n  <div class=\"row note-section\">\n    <div class=\"large-8 large-offset-2 columns\">\n      <div class=\"row\">\n        <div class=\"small-6 columns\">\n          <p class=\"note-detail-header\">\n          TAGS\n          </p>\n          <p class=\"highlight-detail-note-text-2\">\n          </p>\n        </div>\n\n        <div class=\"small-6 columns\">\n          <p class=\"note-detail-header\">\n          FOLDERS\n          </p>\n          <p class=\"highlight-detail-note-text-2\">\n          </p>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!--END the tags and folders block-->\n  <div class=\"row note-metadata-container\">\n    <div class=\"large-12 columns\">\n      <div class=\"row\">\n        <div class=\"small-6 columns\">\n          <div class=\"done-button-container\" >\n            <a class=\"done-button-black button\">DONE</a>\n          </div>\n        </div>\n\n        <div class=\"small-6 columns\">\n          <div class=\"annotator-edit edit-button-container\">\n          <a class=\"edit-button-yellow\" href=\"#\">EDIT THIS NOTE</a>\n          </div>\n        </div>\n\n        <div class=\"small-6 columns\">\n          <div class=\"delete-button-container annotator-delete\" >\n            <a class=\"done-button-black button\">DELETE THIS NOTE</a>\n          </div>\n        </div>\n\n      </div>\n    </div>\n  </div>\n\n</div>");

  Viewer.prototype.hideAllControls = function() {
    this.element.find(".annotator-item").removeClass(this.viewer.classes.showControls);
    return this;
  };

  Viewer.prototype._onLoad = function() {
    var controls;
    controls = this.element.find(".annotator-controls");
    controls.toggleClass("annotator-controls annotator-touch-controls");
    return controls.find("button").addClass("annotator-button");
  };

  Viewer.prototype._onTap = function(event) {
    var isVisible, target;
    target = jQuery(event.currentTarget);
    isVisible = target.hasClass(this.viewer.classes.showControls);
    this.hideAllControls();
    if (!isVisible) {
      return target.addClass(this.viewer.classes.showControls);
    }
  };

  Viewer.prototype._onEdit = function(event) {
    console.log('_onEdit');
    event.preventDefault();
    return this.editor.load(this.currentAnnotation);
  };

  Viewer.prototype._onDone = function() {
    return $('body').toggleClass('active');
  };

  Viewer.prototype._onDelete = function(event) {
    event.preventDefault();
    return this.viewer.publish('delete', this.currentAnnotation);
  };

  return Viewer;

})(Annotator.Delegator);
