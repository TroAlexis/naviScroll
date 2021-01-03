#**naviscroll.js**

Naviscroll.js is a lightweight customizable library for generating a navigation menu 
from the sections on your website and keeping track which one is in view<br/>

It parses the container you give it for `observe-section` elements by default,
gets their headings _(see options section)_, sets section `ids`,
initializes the `observer` for each one to keep track which one is in view now
and goes finding any nested sections repeating same thing for them.

[Live demo](https://codepen.io/troalexis/pen/QWKmaeo)

##Installation

Use [npm](https://www.npmjs.com/) to install and use with a module bundler
```bash
npm install naviscroll
```

Also you can use a CDN

```html
<script src="unpkg.com/naviscroll@1.0.0/naviscroll.js"><script>
```

Or download the zip and put it into your project folder, 
then include directly into HTML

```html
<script src="naviscroll.js"></script>
```

## Usage

Using a module bundler

```javascript
import naviscroll from 'naviscroll/naviscroll.js'
// target can be either a string for query selector ('.sections')
// or a document element (document.querySelector('.sections'))

naviscroll(target, {
  key: value,
});

```

Using a CDN or including directly into HTML
Naviscroll exposes the naviscroll function to window object as well

```javascript
naviscroll(target, {
  key: value,
});
```

## Options
Here are the default options you might want to change:
```javascript
const defaultProps = {
  // Set to false to prevent recursive generation of sections
  subsections: true,
  // Set to false not to create links for sections
  createLinks: true,
  // Element to append to or a selector.
  appendTo: '',
  // Selector for document sections to observe generate navigation from
  sectionsClass: '.observe-section',
  // Selector for document section-heading to generate the names of nav sections
  sectionHeadingClass: '.observe-section__heading',
  // Tag to use for nav element
  navTag: 'nav',
  // Classname to give to navigation element
  navClass: 'naviscroll',
  // Classname for navigation section
  navSectionClass: 'naviscroll__section',
  // Classname for navigation sub-section
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
  onSectionIn: () => {},
  // Function to call when section gets out of view
  onSectionOut: () => {},
  // Root margin for intersection observer
  // should be -100% in sum, otherwise everything may work not right
  rootMargin: '-50% 0px -50% 0px',
  // Root element for intersection observer, browser window by default
  observerRoot: null,
};
```

You can set `data-adclass` attribute on a section
to set the class on the navigation element connected to it
in case you need some control on styling, as well as you can style navigation elements using `data-depth`
indicating how deep the element is in sections.

You can provide your own functions to execute on section getting in and out of view.
The function gets the props object:
```javascript
function userCallBack(props) {
  const { sectionEl, id, navEl, depth } = props;
}
```

## Browser support

The library uses :scope selector and Intersection Observer API
which are not well supported in older browsers, so if you need to support those,
please use the polyfills for: 

- [:scope selector](https://github.com/jonathantneal/element-qsa-scope)
- [Intersection Observer API](https://github.com/w3c/IntersectionObserver)

All the rest is taken care of during the compilation thanks to [Babel](https://babeljs.io/).
