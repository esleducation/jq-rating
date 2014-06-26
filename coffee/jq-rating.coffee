do ($ = jQuery) ->

	# plugin name variable used to identify plugin
	pluginName = 'jqRating'

	# plugin class
	class jqRating

		# constructor
		constructor : (item, options) ->

			# set variables
			@$this = $(item)
			@settings =
				value : 3.5
				retainValue : null 			# store the retain value
				levelsClasses : ['xlow','low','medium','high','xhigh']
				updateOn : 'click'		# define if the actual value will be updated on click or on hover (click | hover)
				starsCount : 5
				basedOn : 5
				iconClass : 'fa fa-star'
				editable : false
				onChange : null 		# callback when value change (params : value, api)
			@$refs =
				starsContainer : null 		# store the stars container if exist
				base : null 			# store the html base stars element
				hover : null 			# store the html hover stars element
				grade : null 			# store the elements to update with the rating value
				starsBase : null 		# store all the base stars
				starsHover : null 		# store all the hover stars
			@levelClass = null 			# store the applied level class to be able to remove it, etc...
			@hoverValue = null			# store hoverValue
			@retainValue = null 			# store retain value, if set, the rating will keep this value forever until release

			# init
			@_init(options)

		###
		# Init
		###
		_init : (options) ->

			# extend with inline settings
			@_extendSettings(options)

			# save the retain value
			@retainValue = @settings.retainValue

			# get the stars container
			@$refs.starsContainer = @$this.find '[data-jq-rating-stars]:first'
			@$refs.starsContainer = @$this if not @$refs.starsContainer.length

			# get all the grades element to update the value
			@$refs.grade = @$this.find '[data-jq-rating-grade]'

			# generate the html
			@_generateHtml()

			# apply base css :
			@_applyBaseCss()

			# add events listeners
			@_addEventsListeners()

			# set the value
			@setValue @settings.value

		###
		# Destroy
		###
		destroy : () ->

			# remove events listeners
			@$refs.starsBase.unbind 'mouseover'
			@$refs.starsBase.unbind 'click'
			@$refs.starsContainer.unbind 'mouseleave'

			# remove the html elements
			@$refs.starsContainer.empty()

			# delete the references
			@$refs.starsContainer = null
			@$refs.base = null
			@$refs.hover = null
			@$refs.grade = null
			@$refs.starsBase = null
			@$refs.starsHover = null
			@$refs.formField = null

			# remove classes
			@$this.removeClass 'jq-rating'
			@$this.removeClass @levelClass if @levelClass
			@$this.removeClass 'jq-rating--editable' if @isEditable()

		###
		# Update
		###
		update : () ->

			# destroy
			@destroy()

			# init again
			@_init()

		###
		# Retain to a certain value
		###
		retain : (value) ->

			# set the value
			@retainValue = value

			# render
			@render()

		###
		# Release
		###
		release : () ->

			# do nothing is not retained
			return if typeof @retainValue is not 'number' or typeof @retainValue is not 'string'

			# reset retain value
			@retainValue = null

			# render
			@render()

		###
		# Generate html
		###
		_generateHtml : () ->

			# add class to container
			@$this.addClass 'jq-rating'

			# add editable class if needed
			@$this.addClass 'jq-rating--editable' if @isEditable()

			# base
			@$refs.base = $('<span class="jq-rating-group" />')

			# hover
			@$refs.hover = $('<span class="jq-rating-group--hover" />')

			# generate the good number of stars
			stars = []
			for i in [0...@settings.starsCount]
				stars.push ['<span class="jq-rating-star">'
						'<i class="'+@settings.iconClass+'"></i>'
					'</span>'].join('')

			# append to html :
			@$refs.starsContainer.append @$refs.base
			          .append @$refs.hover

			# append stars
			@$refs.base.append $(stars.join(''))
			@$refs.hover.append $(stars.join(''))

			# get the stars references
			@$refs.starsBase = @$refs.base.children()
			@$refs.starsHover = @$refs.hover.children()

		###
		# Apply base css
		###
		_applyBaseCss : () ->

			# apply css on stars container if exist
			if @$refs.starsContainer.length
				@$refs.starsContainer.css
					position : 'relative' 
					display : 'inline-block'

			# stars group
			@$refs.base.css
				top : 0
				left : 0
			@$refs.hover.css
				position : 'absolute'
				top : 0
				left : 0
				overflow : 'hidden'
				'white-space' : 'nowrap'
				'pointer-events' : 'none'

			# stars
			@$refs.starsBase.css
				display : 'inline-block'
			@$refs.starsHover.css
				display : 'inline-block'

		###
		# Add events listeners
		###
		_addEventsListeners : () ->

			@$this.find('input[data-jq-rating-grade], textarea[data-jq-rating-grade]').on 'change', (e) =>
				 # grab the content
				value = parseInt(e.currentTarget.value)

				# secure value
				value = 0 if value < 0
				value = @settings.basedOn if value > @settings.basedOn

				# set the value
				@setValue value

			# if editable, listen for hover on stars
			if @isEditable()

				# listen for hover on stars
				@$refs.starsBase.bind 'mouseover', (e) =>

					# index
					index = $(e.currentTarget).index() + 1

					# calculate value
					value = @settings.basedOn / @settings.starsCount * index

					# check if update the value on hover
					if @settings.updateOn == 'hover'

						# update the value
						@setValue value

					# if not, just update the temp value and render
					else

						# set temp value
						@hoverValue = value

						# render
						@render()

				# listen for click
				@$refs.starsBase.bind 'click', (e) =>

					# index
					index = $(e.currentTarget).index() + 1

					# set value
					@setValue @settings.basedOn / @settings.starsCount * index


				# listen for mouse out
				@$refs.starsContainer.bind 'mouseleave', (e) =>
					
					# reset the hover value
					@hoverValue = null

					# render
					@render()


		###
		# Set the rating value
		###
		setValue : (value) ->

			# save the value
			@value = value

			# render
			@render()

			# update each grade
			@$refs.grade.each (index, elm) =>

				# check if is an input or textarea
				switch elm.nodeName.toLowerCase()
					when 'textarea', 'input'
						# update value
						$(elm).val @value
					else
						# update html
						$(elm).html @value

			# fire callbacks
			@settings.onChange(@value, @) if @settings.onChange
			@$this.trigger 'jqRating.change'

		###
		# Render
		###
		render : () ->

			# get the value
			value =  @hoverValue or @value
			value = @retainValue if typeof @retainValue is 'number' or typeof @retainValue is 'string'

			# Calculate the width
			width = 100 / @settings.basedOn * value

			# set the width of the hover element
			@$refs.hover.css
				width : width + '%'

			# manage classes
			levelClassIdx = Math.round((@settings.levelsClasses.length / @settings.basedOn * value) - 1)
			levelClassIdx = 0 if levelClassIdx < 0
			levelClassIdx = @settings.levelsClasses.length-1 if levelClassIdx >= @settings.levelsClasses.length

			@$this.removeClass @levelClass if @levelClass
			@levelClass = 'jq-rating--'+@settings.levelsClasses[levelClassIdx]
			@$this.addClass @levelClass

		###
		# Check if is editable or not
		###
		isEditable : () ->
			editable = @settings.editable and @settings.editable == 'true'
			return editable

		###
		# Extend settings
		###
		_extendSettings : (options) ->

			# extend options
			@settings = $.extend @settings, options, true if options?

			# extend options with inline ones :
			$.each @$this.get(0).attributes, (index, attr) =>

				# process name
				name = attr.name
				name = name.substr('data-jq-rating-'.length)
				name = name.replace /-([a-z])/g, (g) ->
					return g[1].toUpperCase();

				return if not name

				# check if is a settings like this
				@settings[name] = attr.value if @settings[name] != undefined


	###
	# jQuery controller :
	###
	$.fn.jqRating = (method) ->

		if jqRating.prototype[method]

			# store arguments to use later
			args = Array.prototype.slice.call( arguments, 1 )

			# apply on each elements
			this.each () ->
				# get the plugin instance from element
				plugin = $(this).data pluginName+'_api'
				# call the method on plugin if exist
				plugin[method].apply( plugin, args)

		else if typeof method == 'object' or not method

			# store arguments to use later
			args = Array.prototype.slice.call( arguments )

			this.each () ->

				$this = $(this)

				# do nothing if already inited
				return if $this.data(pluginName+'_api')? and $this.data(pluginName+'_api') != ''

				# make initialisation of plugin
				plugin = new jqRating this, args[0]

				# save plugin in element
				$(this).data pluginName+'_api', plugin

		else
			$.error 'Method ' +  method + ' does not exist on jQuery.jqRating'	