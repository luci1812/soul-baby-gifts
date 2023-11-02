// Slider 
function sliderBasic () {
  let slidersElements = document.querySelectorAll('[slider-base]');
  let numberGroup;
  let showDots = false;
  let showArrows = false;
  let wrapAround = false;
  let draggable = true;

  slidersElements.forEach((Element) => {
    if (Element.getAttribute('slider-group') == '') {
      numberGroup = 2;
    } else {
      numberGroup = 1;
    }

    if (Element.getAttribute('slider-show-dots') == '') {
      showDots = true;
    } 

    if (Element.getAttribute('slider-show-arrows') == '') {
      showArrows = true;
    }

    if (Element.classList.contains('blog__posts')) {
      wrapAround = true;
    } 

    const defaultOptions = {
      cellAlign: 'left',
      // freeScroll: true,
      prevNextButtons: showArrows,
      pageDots: showDots,
      contain: true,
      draggable: draggable,
      adaptiveHeight: false,
      groupCells: numberGroup,
      wrapAround: wrapAround
    }

    if ( matchMedia('screen and (max-width: 749px)').matches ) {
      defaultOptions.pageDots = true;
      defaultOptions.draggable = true;
    }

    var flkty = new Flickity( Element, defaultOptions);
   
  })
}

sliderBasic();

//Slider Article
function sliderArticle () {
  let slidersElements = document.querySelectorAll('.related__article .related__article--slider');
  let draggable = true;
  let showArrows = true;
  let showDots = true;

  slidersElements.forEach((Element) => {
    if (Element.classList.contains('slider__mobile') && document.querySelector('body').offsetWidth > 749 ) {
      draggable = false; 
      showArrows = false;
      showDots = false;
    } 

    const defaultOptions = {
      cellAlign: 'left',
      prevNextButtons: showArrows,
      pageDots: showDots,
      contain: true,
      draggable: draggable,
      adaptiveHeight: false,
      wrapAround: true
    }

    var flkty = new Flickity( Element, defaultOptions);
   
  })
}

sliderArticle();

// 
(function () {
  let sectionRounded =  document.querySelectorAll('.section__border-bottom');
  let sectionBanner = document.querySelector('.section__banner ');
  if (sectionRounded.length) {
    sectionRounded.forEach(Element => {
      Element.closest('.shopify-section').classList.add('shopify-section-rounded');
    })
  }

  sectionBanner && sectionBanner.previousSibling.classList.add('Sibling-banner');
})();

 // Collapsible Content 
 class CollapsibleContent extends HTMLElement {
  constructor(){
    super();
    this.headingMobile = this.querySelector('.collabsible__title--mobile');
    this.heading = this.querySelector('.collabsible__title');
    let bodyWidth = document.querySelector('body').offsetWidth;

    if (this.headingMobile && bodyWidth < 750) {
      this.headingMobile.addEventListener('click', this.showContent.bind(this));
    }

    if (this.heading) {
      this.heading.addEventListener('click', this.showContent.bind(this));      
    }
  }

  showContent() {
    let _this = this;
    _this.classList.toggle('active');
  }
}

customElements.define('collapsible-content', CollapsibleContent);

//Handle Monogram
class MonogramPopup extends HTMLElement {
  constructor(){
    super();
    this.inputMonogram = document.querySelector('.field__monogram input');
    this.buttonClose = this.querySelector('.js-close-popup');
    this.buttonSave = this.querySelector('.button__save');
    this.body = document.querySelector('body');
    this.buttonNextStep = this.querySelector('.button__next--step');
    this.buttonPrevStep = this.querySelector('.button__prev--step');
    this.stepOne = this.querySelector('.step__1');
    this.stepTwo = this.querySelector('.step__2');
    this.fontList = this.querySelectorAll('.font__options input');
    this.inputText = this.querySelector('input.monogram');
    this.productForm = document.querySelector('product-form .form');
    this.buttonEdit = document.querySelector('.result__monogram--handle .js-edit');
    this.buttonRemove = document.querySelector('.result__monogram--handle .js-remove');
    this.resultMonogram = document.querySelector('.result__monogram ');
    
    if ( this.querySelector('.monogram__popup--content[data-suitcase="false"]')) {
      this.text = this.querySelector('.monogram__popup--content .view__text');      
    } else {
      this.text = this.querySelector('.monogram__popup--content p');
    }

    if (this.inputMonogram) {
      this.inputMonogram.addEventListener('change', (e) => {
        if ( this.inputMonogram.checked) {
          this.isShowPopup();
        } else {
          this.isRemoveMonogram();
        }
      }); 
  
      this.buttonClose.addEventListener('click', () => {
        this.isHidePopup();
      });    
      
      this.buttonNextStep.addEventListener('click', () => {
        this.isNextstep();
      });

      this.buttonPrevStep.addEventListener('click', () => {
        this.isBackStep();
      });

      this.buttonSave.addEventListener('click', () => {
        this.isHidePopup();
        this.isSaveMonogram();
      });

      this.buttonEdit.addEventListener('click', () => {
        this.isShowPopup();
      });

      this.buttonRemove.addEventListener('click', () => {
        this.isRemoveMonogram();
      });      

      this.handleFont();
      this.handleText();
      this.handleFontSize();
    }
  }

  isShowPopup() {
    let _this = this;
    _this.classList.add('is-active');
    _this.body.classList.add('overflow-hidden');
  }

  isHidePopup() {
    let _this = this;
    _this.classList.remove('is-active');
    _this.body.classList.remove('overflow-hidden');
    if(this.inputText.value.length == 0 || this.resultMonogram.querySelector('.js-text').textContent.length == 0) {
      this.inputMonogram.checked = false;
    }
  }

  isNextstep() {
    this.stepOne.style.display = 'none';
    this.stepTwo.classList.add('active');
  }

  isBackStep() {
    this.stepOne.style.display = 'block';
    this.stepTwo.classList.remove('active');
  }

  handleFont() {
    this.fontList.forEach((input, index)=> {
      if (input.value ==  'font-playful') {
        input.checked = true;
      }

      input.addEventListener('change', () =>{ 
        this.text.classList.remove('font-classic', 'font-playful', 'font-bold', 'font-stylish', 'font-fancy');
        if (input.checked) {
          this.text.classList.add(input.value);
        }
      })
      
    });
  }

  handleText() {
    this.inputText.addEventListener('input', () => {
      let newContent = this.inputText.value.slice(0, 30);
      this.text.textContent = newContent;
      this.inputText.value = newContent;
    });
  }

  handleFontSize() {
    this.inputText.addEventListener('input', () => {
      let currentLength = this.inputText.value.length;
      this.text.classList.remove("fs-13", "fs-18", "fs-24", "fs-32", "fs-48");

      if (currentLength >= 20 && currentLength <= 30) {
        this.text.classList.add("fs-13");
      } else if (currentLength >= 15 && currentLength < 20) {
        this.text.classList.add("fs-18");
      } else if (currentLength >= 10 && currentLength < 15) {
        this.text.classList.add("fs-24");
      } else if (currentLength >= 5 && currentLength < 10) {
        this.text.classList.add("fs-32");
      } else if (currentLength >= 0 && currentLength < 5) {
        this.text.classList.add("fs-48");
      }
    });
  }

  isSaveMonogram() {   
    let labelContent;

    this.inputMonogram.checked = true;
    this.resultMonogram.classList.remove('visually-hidden');
    this.fontList.forEach(input => {
      if (input.checked) {
        labelContent = document.querySelector(`label[for="${input.id}"]`).textContent;
      }
    });
    this.resultMonogram.querySelector('.js-font-name').textContent = labelContent;
    this.resultMonogram.querySelector('.js-text').textContent = this.inputText.value;

    this.productForm.querySelector('.js-text-font').value = labelContent;
    this.productForm.querySelector('.js-text-content').value = this.inputText.value;

    this.styleTabletdown();
  }

  isRemoveMonogram() {
    this.resultMonogram.classList.add('visually-hidden');
    this.productForm.querySelector('.js-text-font').value = '';
    this.productForm.querySelector('.js-text-content').value = '';
    this.inputMonogram.checked = false;
  }

  styleTabletdown() {
    if(this.inputText.value.length > 10 && this.body.offsetWidth < 990) {
      document.querySelector('.result__monogram--content').classList.add('result__monogram--content-column');
    } else {
      document.querySelector('.result__monogram--content').classList.remove('result__monogram--content-column');
    }
  }
}

customElements.define('monogram-popup', MonogramPopup);