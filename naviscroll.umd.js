const mainDOM={sectionsClass:"observe-section",navClass:"naviscroll"},defaultProps={subsections:!0,createLinks:!0,setSectionIds:!0,appendTo:"",sectionsClass:`.${mainDOM.sectionsClass}`,sectionHeadingClass:`.${mainDOM.sectionsClass}__heading`,buildNav:!0,onSectionBuild:({sectionEl:e,navSectionEl:n,parent:t,depth:s})=>{},navTag:"nav",navClass:mainDOM.navClass,navSectionClass:`${mainDOM.navClass}__section`,navSubSectionClass:`${mainDOM.navClass}__sub-section`,navListType:"ul",navSectionTag:"li",idString:"",idSeparator:"-",observe:!0,onSectionIn:({sectionEl:e,navEl:n,id:t,depth:s})=>{},onSectionOut:({sectionEl:e,navEl:n,id:t,depth:s})=>{},rootMargin:"-50% 0px -50% 0px",observerRoot:null};class Naviscroll{constructor(e,n){const t="object"==typeof n?n:{};this.props={...defaultProps,...t},this.sectionsContainer="string"==typeof e?document.querySelector(e):e,this.init()}goOverSections(e,n){if(!e)return;const{sectionsClass:t,idSeparator:s,idString:o,subsections:i}=this.props,{sectionEl:a,id:c,navEl:r,depth:l=-1}=e,d=a.querySelectorAll(`:scope > ${t}`);0!==d.length&&d.forEach((e,t)=>{const a={sectionEl:e,id:c?`${c}${s}${t+1}`:`${o?o+s:o}${t+1}`,navEl:r,depth:l+1};n&&(a.navEl=n(a)),i&&this.goOverSections(a,n)})}buildNavSection(e,n){const{navEl:t,id:s,sectionEl:o,depth:i}=e,{navSectionClass:a,navSubSectionClass:c,navListType:r,navSectionTag:l,sectionHeadingClass:d,createLinks:p,setSectionIds:v}=this.props,u=document.createElement(l);u.className=`\n        ${a}\n     `;const h=getSectionHeading({sectionEl:o,sectionHeadingClass:d});if(p&&v){const e=document.createElement("a");e.href=`#${s}`,e.textContent=h,u.appendChild(e)}else u.textContent=h;if(t){const e=getSubsectionContainer(t,r);if(e)e.appendChild(u);else{const e=document.createElement(r);e.className=c,e.dataset.depth=i,e.appendChild(u),t.appendChild(e)}}else this.navWrapper.appendChild(u);return n({sectionEl:o,navSectionEl:u,navElParent:t,depth:i}),u}buildNav(){const{navClass:e,appendTo:n,navTag:t,navListType:s}=this.props;this.navEl=document.createElement(t),this.navEl.className=e;const{navEl:o,sectionsContainer:i}=this;this.navWrapper=document.createElement(s),this.navWrapper.className=`${e}__wrapper`,n?"string"==typeof n?document.querySelector(n):n.appendChild(o):i.parentElement.insertBefore(o,i)}toggleActiveSection({navEl:e},n){const{navSectionClass:t}=this.props,s=`${t}--active`;e.classList[n](s)}init(){const{buildNav:e,setSectionIds:n}=this.props;e&&this.buildNav();const{onSectionBuild:t,onSectionIn:s,onSectionOut:o,observe:i,rootMargin:a,observerRoot:c}=this.props;this.goOverSections({sectionEl:this.sectionsContainer},r=>(n&&setElementId(r),i&&sectionObserver({onSectionIn:()=>{e&&this.toggleActiveSection(r,"add"),s(r)},onSectionOut:()=>{e&&this.toggleActiveSection(r,"remove"),o(r)},rootMargin:a,root:c}).observe(r.sectionEl),e?this.buildNavSection(r,t):null)),e&&this.navEl.appendChild(this.navWrapper)}}function setElementId(e){const{sectionEl:n,id:t}=e;n.id=t}function getSectionHeading({sectionEl:e,sectionHeadingClass:n}){if(n){const t=e.querySelector(n);return t?t.textContent:e.dataset.heading}return e.dataset.heading}function getSubsectionContainer(e,n){return e.querySelector(`:scope > ${n}`)}function sectionObserver({onSectionIn:e,onSectionOut:n,rootMargin:t,root:s}){return new IntersectionObserver(t=>{t.forEach(t=>{t.isIntersecting?e():n()})},{root:s,rootMargin:t})}window.naviscroll=function(e,n){return new Naviscroll(e,n)};