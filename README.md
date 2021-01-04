# **naviscroll.js**

Naviscroll.js is a lightweight customizable library for generating a navigation menu 
from the sections on your website and keeping track which one is in view.<br/>

It parses the container you give it for elements with `observe-section` class by default,
gets their headings _(see options section)_, sets section `ids`,
initializes the `Intersection Observer` for each one to keep track which one is in view now,
and goes finding any nested sections repeating same thing for them.

You can hook into the navigation build process with `onSectionBuild`
and add extra actions to do as well as set a custom function
to execute on section getting in or out of view with `onSectionIn` and `onSectionOut`
to enrich it with fancy animations, for example.

[Check out a live demo](https://codepen.io/troalexis/pen/QWKmaeo)

## Installation

Use [npm](https://www.npmjs.com/) to install and use with a module bundler.
```bash
npm install naviscroll
```

Also you can use a CDN.

```html
<script src="https://unpkg.com/naviscroll@1.1.0/naviscroll.umd.js"></script>
```

Or download the zip and put it into your project folder, 
then include directly into HTML.

```html
<script src="naviscroll.umd.js"></script>
```

## Usage

Using a module bundler

```javascript
import naviscroll from 'naviscroll'
// target can be either a string for query selector ('.sections')
// or a document element (document.querySelector('.sections'))

naviscroll(target, {
  key: value,
});

```

Using a CDN or including directly into HTML
Naviscroll exposes the naviscroll function to window object

```javascript
naviscroll(target, {
  key: value,
});
```

## Options
Here are the default options you are free to override within options passed to `naviscroll`:

```javascript
// DEFAULTS
const defaultProps = {
  // Set to false to prevent recursive generation of sections
  subsections: true,

  // Set to false not to create links for sections
  createLinks: true,

  // Set to false to disable setting ids for sections
  setSectionIds: true,

  // Element to append to or a selector.
  appendTo: '',

  // Selector for document sections to observe generate navigation from
  sectionsClass: '.observe-section',

  // Selector for document section-heading to generate the names of nav sections
  // You can also set headings via data-heading attribute on the section itself
  sectionHeadingClass: '.observe-section__heading',

  // Set to false to disable building navigation to use only sections observer
  buildNav: true,

  // Function to execute on section build to add extra classes or properties.
  onSectionBuild: ({
    sectionEl,
    navSectionEl,
    parent,
    depth,
  }) => {},

  // Tag to use for nav element
  navTag: 'nav',

  // Classname to give to navigation element
  navClass: 'naviscroll',
  
  // Classname for navigation section
  navSectionClass: 'naviscroll__section',
  
  // Classname for navigation sub-sections container
  navSubSectionClass: 'naviscroll__sub-section',
  
  // Type of list to use in navigation
  navListType: 'ul',

  // Type of element to create for navigation section
  navSectionTag: 'li',

  // String to insert before id number;
  idString: '',

  // String to separate sections and subsections ids
  idSeparator: '-',

  // Set to false to disable observing sections
  observe: true,

  // Function to call when section gets into view
  onSectionIn: ({
    sectionEl, navEl, id, depth,
  }) => {
    // do stuff with elements here
  },

  // Function to call when section gets out of view
  onSectionOut: ({
    sectionEl, navEl, id, depth,
  }) => {
    // do stuff with elements here
  },

  // Root margin for intersection observer
  rootMargin: '-50% 0px -50% 0px',

  // Root element for intersection observer, viewport by default
  observerRoot: null,

};
```

You can style navigation elements using `data-depth`
indicating how deep the element is in sections.

Note that you can use `data-heading` attribute on the section
to set the heading you want in the navigation.

## Browser support

ES6 compatible browsers are supported out of the box, but if you need IE
support you might want to use polyfills for `object destructuring`, `js Classes`, `NodeList.prototype.ForEach`, `Element.classList`
or just put it through [Babel](https://babeljs.io/).

The library uses :scope selector and Intersection Observer API
which are not well-supported in older browsers, so if you need to support those,
please use the polyfills for: 

- [:scope selector](https://github.com/jonathantneal/element-qsa-scope)
- [Intersection Observer API](https://github.com/w3c/IntersectionObserver)
