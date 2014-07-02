# jq-rating (1.0.0)


jQuery plugin to display "stars" (or something else) based ratings


## Demo

You can find some demos here : http://esleducation.github.io/jq-rating/


## Install

You can simply download or clone the repo, or install using bower like this

```text
bower install jq-rating
```


## Get Started

First, you need to include the scripts and css in your page

```html
<link href="jq-rating.css" rel="styletheet" type="text/css" />
<!-- optional font-awesome to have access to icons -->
<link href="font-awesome.css" rel="styletheet" type="text/css" />

<script src="jquery.js"></script>
<script src="jq-rating.js"></script>
```

Then you just have to init the plugin as you do with all others jQuery plugins

```html
<span data-jq-rating></span>

<!-- or if you need to specify where each elements are goiing to stand -->
<span data-jq-rating>
	<span data-jq-rating-stars></span><!-- display the stars here -->
	<span data-jq-rating-grade></span><!-- display the grade (value) here -->
</span>
```

```javascript
jQuery(function($) {
	
	// init the plugin on all "data-jq-rating" elements
	$('[data-jq-rating]').jqRating();

});
```

> See the index.html file for full sample


## Options

There are all the options available

* __value__          : the actual rating value
* __basedOn__        : the max rating value
* __starsCount__     : how many "stars" you want
* __updateOn__       : when you want that the value is updated (click | hover)
* __iconClass__      : the class to use for icons (default : fa fa-star)
* __editable__       : define if the rating is editable or not
* __levelsClasses__  : array of levels that will be applied on container with pattern : jq-rating--{level}
* __onChange__       : callback when the value change (params : value, api)not after the stars

> Each of these options can be passed to the plugin options, or can be put directly on the element like this
>
> ```html
> <span data-jq-rating
        data-jq-rating-{option-with-dash-as-separator}="{value}"
        data-jq-rating-stars-count="12"
        data-jq-rating-icon-class="fa fa-user">
  </span>
> ```


## Attributes

jq-rating provide some attributes that you can use to display informations where you want in your html

* __data-jq-rating-stars__       : This attribute tell where to inject the stard
* __data-jq-rating-grade__       : This tell where to inject the value. Can be applied also on input or textarea

> If the attribute __data-jq-rating-stars__ is not present, the stard will be injected directly on the element on witch the plugin is instanciated


## Classes

These are the diferent classes that are applied

* __jq-rating__                     : The container
    * __jq-rating--level-xlow__               : Applied on the container when the rating level is extra-low
    * __jq-rating--level-low__                : Applied on the container when the rating level is low
    * __jq-rating--level-medium__             : Applied on the container when the rating level is medium
    * __jq-rating--level-high__               : Applied on the container when the rating level is high
    * __jq-rating--level-xhigh__              : Applied on the container when the rating level is exta-high
    * __jq-rating--editable__           : Applied on the container when the rating is editable
* __jq-rating-group__               : The group of stars
    * __jq-rating-group--hover__    : The group of stars that will be active (the width of this element will be set by the plugin)
* __jq-rating-star__                : The star that contain a "i" tag
    * __jq-rating-star--active__        : Applies on the stars that are active


## Updating a form input

It can be usefull to be able to update a form input with the value of an editable rating. This is how you can do this

```html
<form name="myForm" action="#" method="POST">

   <span data-jq-rating
      data-jq-rating-value="4.5">
      <span data-jq-rating-stars></span>
      <input type="text" data-jq-rating-grade />
   </span>

</form>
```

The attribute __data-jq-rating-grade__ will take car of updating the field value accordingly. This works in two ways, mean that if you update the field, the rating will update itself.


