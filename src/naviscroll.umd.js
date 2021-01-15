// Dependencies
// https://github.com/jonathantneal/element-qsa-scope
// :scope polyfill to support older browsers;
// import 'element-qsa-scope';
// https://github.com/w3c/IntersectionObserver
// Intersection observer API polyfill for older browsers
// import 'intersection-observer';

// Block strings for easier BEM
const mainDOM = {
  sectionsClass: 'observe-section',
  navClass: 'naviscroll',
};

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
  sectionsClass: `.${mainDOM.sectionsClass}`,

  // Selector for document section-heading to generate the names of nav sections
  // You can also set headings via data-heading attribute on the section itself
  sectionHeadingClass: `.${mainDOM.sectionsClass}__heading`,

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
  navClass: mainDOM.navClass,

  // Classname for navigation section
  navSectionClass: `${mainDOM.navClass}__section`,

  // Classname for navigation sub-section
  navSubSectionClass: `${mainDOM.navClass}__sub-section`,

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

class Naviscroll {
  constructor(target, props) {
    // Validate user props
    const o = typeof props === 'object'
      ? props
      : {};

    // Mix defaultProps with userProps
    this.props = {
      ...defaultProps,
      ...o,
    };

    // Get main container for sections
    this.sectionsContainer = typeof target === 'string'
      ? document.querySelector(target)
      : target;

    // Initialize navigation.
    this.init();
  }

  // Recursive method to go over all sections and nested ones if any
  goOverSections(props, callback) {
    // Break if no props provided
    if (!props) {
      return;
    }

    const {
      sectionsClass, idSeparator, idString, subsections,
    } = this.props;

    const {
      sectionEl, id, navEl, depth = -1,
    } = props;
    // Get all subsections of the current section
    const sectionsFound = sectionEl.querySelectorAll(`:scope > ${sectionsClass}`);

    // If aren't any - break.
    if (sectionsFound.length === 0) {
      return;
    }
    // If sections are found, iterate over each section generating new props
    sectionsFound.forEach((sectionFound, sectionIndex) => {
      const childProps = {
        sectionEl: sectionFound,
        id: id
          ? `${id}${idSeparator}${sectionIndex + 1}`
          : `${idString ? idString + idSeparator : idString}${sectionIndex + 1}`,
        navEl,
        depth: depth + 1,
      };
      // Do stuff with each section found and return the created
      // navigation element to pass to new iteration
      if (callback) {
        childProps.navEl = callback(childProps);
      }

      // If subsection property is true, go deeper into sub-sections if any
      if (subsections) {
        this.goOverSections(childProps, callback);
      }
    });
  }

  // Method to build a navigation section based on props
  buildNavSection(props, callback) {
    // Rename navEl prop to parent for simplicity
    const {
      navEl: parent, id, sectionEl, depth,
    } = props;
    const {
      navSectionClass,
      navSubSectionClass,
      navListType,
      navSectionTag,
      sectionHeadingClass,
      createLinks,
      setSectionIds,
    } = this.props;

    // Creates a li element by default with extra classes and id class.
    const navSectionEl = document.createElement(navSectionTag);
    navSectionEl.className = `
        ${navSectionClass}
     `;
    const sectionHeading = getSectionHeading({
      sectionEl,
      sectionHeadingClass,
    });
    if (createLinks && setSectionIds) {
      // Create a link to navigate to a section.
      const navSectionLink = document.createElement('a');
      navSectionLink.href = `#${id}`;
      // set link name from section heading.
      navSectionLink.textContent = sectionHeading;
      // append link to nav-section element.
      navSectionEl.appendChild(navSectionLink);
    } else {
      navSectionEl.textContent = sectionHeading;
    }

    if (parent) {
      // If a subsections container already exists, append to it
      const subsectionsContainer = getSubsectionContainer(parent, navListType);

      if (subsectionsContainer) {
        subsectionsContainer.appendChild(navSectionEl);
      } else {
      // Otherwise, create a subsection container
        const navSubsection = document.createElement(navListType);
        navSubsection.className = navSubSectionClass;
        // Append data-depth attribute to provide extra options for styling, for example
        navSubsection.dataset.depth = depth;
        // Append new nav-section element to it
        navSubsection.appendChild(navSectionEl);
        // Append to parent section element
        parent.appendChild(navSubsection);
      }
    } else {
      // If no parent provided, append to the core wrapping element
      this.navWrapper.appendChild(navSectionEl);
    }
    callback({
      sectionEl,
      navSectionEl,
      navElParent: parent,
      depth,
    });
    // Return the created element to use with observer
    return navSectionEl;
  }

  buildNav() {
    const {
      navClass, appendTo, navTag, navListType,
    } = this.props;
    this.navEl = document.createElement(navTag);
    this.navEl.className = navClass;

    const { navEl, sectionsContainer } = this;

    this.navWrapper = document.createElement(navListType);
    this.navWrapper.className = `${navClass}__wrapper`;

    // if element or selector provided, append to it
    if (appendTo) {
      if (typeof appendTo === 'string') {
        document.querySelector(appendTo);
      } else {
        appendTo.appendChild(navEl);
      }
    } else {
      // insert into parent element before the nav el.
      sectionsContainer.parentElement.insertBefore(navEl, sectionsContainer);
    }
  }

  toggleActiveSection({ navEl }, action) {
    const { navSectionClass } = this.props;
    const activeClass = `${navSectionClass}--active`;
    navEl.classList[action](activeClass);
  }

  init() {
    const { buildNav, setSectionIds } = this.props;
    // Build navigation base;
    if (buildNav) {
      this.buildNav();
    }

    // Get onSectionIn and onSection out functions provided by user
    const {
      onSectionBuild,
      onSectionIn,
      onSectionOut,
      observe,
      rootMargin,
      observerRoot: root,
    } = this.props;

    // Execute callback function on every section found.
    const sectionsCallback = (props) => {
      // Set element id.
      if (setSectionIds) {
        setElementId(props);
      }
      if (observe) {
        // Initialize observer with user-provided functions.
        sectionObserver({
          onSectionIn: () => {
            onSectionIn(props);
            if (buildNav) {
              this.toggleActiveSection(props, 'add');
            }
          },
          onSectionOut: () => {
            if (buildNav) {
              this.toggleActiveSection(props, 'remove');
            }
            onSectionOut(props);
          },
          rootMargin,
          root,
        }).observe(props.sectionEl);
      }
      if (buildNav) {
        return this.buildNavSection(props, onSectionBuild);
      }
      return null;
    };

    this.goOverSections({
      sectionEl: this.sectionsContainer,
    }, sectionsCallback);
    if (buildNav) {
      // Append nav-wrapper to the nav element after all build processes finished
      this.navEl.appendChild(this.navWrapper);
    }
  }
}

// Helper functions and observers.

function setElementId(props) {
  const { sectionEl: el, id } = props;
  el.id = id;
}

function getSectionHeading({ sectionEl, sectionHeadingClass }) {
  if (sectionHeadingClass) {
    const sectionHeading = sectionEl.querySelector(sectionHeadingClass);
    return sectionEl.dataset.heading ? sectionEl.dataset.heading : sectionHeading.textContent;
  }
  return sectionEl.dataset.heading;
}

function getSubsectionContainer(element, containerSelector) {
  return element.querySelector(`:scope > ${containerSelector}`);
}

function sectionObserver({
  onSectionIn, onSectionOut, rootMargin, root,
}) {
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onSectionIn();
      } else {
        onSectionOut();
      }
    });
  }, {
    root,
    rootMargin,
  });
}

window.naviscroll=function(e,n){return new Naviscroll(e,n)};

