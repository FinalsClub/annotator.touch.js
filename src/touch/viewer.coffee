# Wrapper around the Annotator.Viewer class. Augments the interface with
# tap friendly buttons and touch event handlers. Rather than creating a new
# class or extending the Annotator.Viewer class we use the wrapper to
# change the current interface without having to heavily monkey patch the
# Annotator core.
class Annotator.Plugin.Touch.Viewer extends Annotator.Delegator
  jQuery = Annotator.$

  # Events bound to the element.
  events:
    ".annotator-item tap":   "_onTap"
    ".annotator-edit tap":   "_onEdit"
    ".annotator-delete tap": "_onDelete"
    ".done-button-container tap": "_onDone"
    ".done-button-container click": "_onDone"

  # Sets up the wrapper and instance methods.
  #
  # viewer  - An instance of Annotator.Viewer.
  # options - An object of instance options.
  #
  # Returns nothing.
  constructor: (@viewer, @editor, options) ->
    super @viewer.element[0], options

    @element.unbind("click")
    @viewer.hide = ->
    @viewer.show = ->
    # @element.addClass("annotator-touch-widget annotator-touch-viewer row gray-background")
    @element.addClass('row')
    @element.removeClass("annotator-hide annotator-outer annotator-viewer")
    @element.attr('role', 'complimentary')
    @element.attr('id', 'sidebar')


    @on("load", @_onLoad)


  #load annotations from for offcanvas
  load: (annotations) ->
    @element.empty()
    @currentAnnotation = annotations
    # put the new html in the element
    @element.html(@template(annotations[0]))
    #switches the view that is on canvas
    $('body').toggleClass('active')

  # @template(obj) is how you use a handlebars template

  template: Handlebars.compile("""
      <div class="large-12 columns">

        <!--BEGIN the text from the document that has been highlighted by the user-->
        <div class="row gray-background">
          <div class="large-8 large-offset-2 columns highlight-view-container">
            <p class="highlight-detail-highlighted-text vertical-color-1">{{{quote}}}</p>

          </div>

        </div>

        <!--END the text from the document that has been highlighted by the user-->

        <!--BEGIN the text of the annotation-->

        <div class="row note-section">
          <div class="large-8 large-offset-2 columns highlight-note-container">
            <p class="note-detail-header">
            NOTE
            </p>
            <p class="highlight-detail-note-text-2">{{{text}}}
            </p>
          </div>
        </div>

        <!--END the text of the annotation-->

        <!--BEGIN the tags and folders block-->

        <div class="row note-section">
          <div class="large-8 large-offset-2 columns">
            <div class="row">
              <div class="small-6 columns">
                <p class="note-detail-header">
                TAGS
                </p>
                <p class="highlight-detail-note-text-2">
                </p>
              </div>

              <div class="small-6 columns">
                <p class="note-detail-header">
                FOLDERS
                </p>
                <p class="highlight-detail-note-text-2">
                </p>
              </div>
            </div>
          </div>
        </div>

        <!--END the tags and folders block-->
        <div class="row note-metadata-container">
          <div class="large-12 columns">
            <div class="row">
              <div class="small-6 columns">
                <div class="done-button-container" >
                  <a class="done-button-black button">DONE</a>
                </div>
              </div>

              <div class="small-6 columns">
                <div class="annotator-edit edit-button-container">
                <a class="edit-button-yellow" href="#">EDIT THIS NOTE</a>
                </div>
              </div>

              <div class="small-6 columns">
                <div class="delete-button-container annotator-delete" >
                  <a class="done-button-black button">DELETE THIS NOTE</a>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
  """)
  # Public: Hides edit controls for all displayed annotations.
  #
  # Examples
  #
  #   jQuery(document).click ->
  #     viewer.hideAllControls()
  #
  # Returns itself.
  hideAllControls: ->
    @element.find(".annotator-item").removeClass(@viewer.classes.showControls)
    this

  # Event handler called when a field is loaded. Augments the field with
  # additonal classes and event handlers.
  #
  # Returns nothing.
  _onLoad: =>
    controls = @element.find(".annotator-controls")
    controls.toggleClass("annotator-controls annotator-touch-controls")
    controls.find("button").addClass("annotator-button")

  # Callback event called when a field is tapped.
  #
  # event - A jQuery.Event touchend event.
  #
  # Returns nothing.
  _onTap: (event) ->
    # console.log('_onTap');
    target = jQuery(event.currentTarget)
    isVisible = target.hasClass(@viewer.classes.showControls)
    @hideAllControls()
    target.addClass(@viewer.classes.showControls) unless isVisible

  # Callback event called when an edit button is tapped.
  #
  # event - A jQuery.Event touchend event.
  #
  # Returns nothing.
  _onEdit: (event) ->
    console.log('_onEdit')
    event.preventDefault()
    # @viewer.onEditClick(event)
    @editor.load(@currentAnnotation)

  # Callback event called when an delete button is tapped.
  #
  # event - A jQuery.Event touchend event.
  #
  # Returns nothing.
  _onDone: ->
    # console.log('done')
    $('body').toggleClass('active')

  _onDelete: (event) ->
    # console.log('_onDelete')
    event.preventDefault()
    @viewer.publish('delete', @currentAnnotation)
    # @viewer.onDeleteClick(event)
