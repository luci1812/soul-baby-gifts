class BuildGift extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (e) =>{
      if(e.target.dataset.handle) {
        e.preventDefault();
        this.onHandleClick(e);
      }
    });

    this.addEventListener('change', (e) =>{
      this.onHandleChange(e)
    });

    this.addEventListener('input', (e) =>{
      this.setMonogramText(e);
    });

    this.monogramText = this.querySelector('[data-monogram-text]')
    this.fillProductCount = 1;
    this.button = this.querySelector('.js-btn-submit');
    this.config = document.getElementById('cart-config');
    this.getCartConfig(this.config);
    this.init();
  }

  init() {
    let url = new URL(window.location);
    let href = url.href;
    let newUrl;
    if (href.endsWith("/")) {
      newUrl = href.slice(0, -1);
    }
    else {
      newUrl = href;
    }

    if(href.includes('step-')){
      let splitUrl = href.split('step')[0]
      if (splitUrl.endsWith("/")) {
        splitUrl = splitUrl.slice(0, -1);
      }
      else {
        splitUrl = splitUrl;
      }
      history.replaceState({ }, '',`${splitUrl}`);
    }

    if (document.getElementById('monogramFont') && document.getElementById('monogram_style')) {
      // document.getElementById('monogram_style').value = document.getElementById('monogramFont').value;
      this.monogramText.classList.add(`font-${document.getElementById('monogramFont').value}`);
    }
  }

  onHandleClick(e) {
    const elementTarget = e.target.dataset.handle;
    const currentStep = `${e.target.closest('.buildGift__item').getAttribute('data-step')}`
    
    if (elementTarget.trim() == 'gift-type') {
      this.renderPackageList(e.target);
      this.setColorBanner(`color-${e.target.dataset.colorScheme}`);
      const dataCollectionGift = e.target.closest('.buildGift__type').querySelector('[data-gift]')
      if (!dataCollectionGift) return
   
      this.renderCollectionGift(dataCollectionGift.getAttribute('data-gift'))
    }
    if (elementTarget.trim() == 'gift-package') this.setMonogramProduct(e);
    if(elementTarget.trim() == 'gift-fill-product') {
      if (this.querySelector('.buildGift__fillGift-CTA')) {
        this.querySelector('.buildGift__fillGift-CTA').style.display = "block";
      }
      this.setProductFillGift(e,this.fillProductCount);
      this.fillProductCount += 1;
    }
    if(elementTarget.trim() == 'gift-monogram') this.cloneMonogramImage(e);

    if (e.target.hasAttribute('data-next-step')) {
      this.updateStatus(currentStep, e.target.closest('.buildGift__item'));
      this.updateUrl(currentStep);
    }
  }

  onHandleChange(e) {
    if (e.target.hasAttribute("data-package-select")) {
      const dataSetPackage = {
        src: e.target.dataset.media,
        price: e.target.dataset.price,
        title: e.target.dataset.title,
        url: e.target.dataset.url,
      }
      this.updatePackage(e.target, dataSetPackage)
    }
    if (e.target.name.includes('monogram')) {
      e.target.style.color = "#444";
      this.setMonogramFont(e);
    }
    if (e.target.id == "confirm_card" && e.target.closest('.js-buildGift__cardMessage').querySelector('#message_textarea')) {
      if(e.target.checked) {
        e.target.closest('.js-buildGift__cardMessage').querySelector('#message_textarea').disabled = true;
      }
      else{
        e.target.closest('.js-buildGift__cardMessage').querySelector('#message_textarea').disabled = false;
      }
    }
  }

  setColorBanner(colorSchema) {
    
    const buildGiftBanner = document.querySelector('.js-color-banner');
    const defaultColorBanner = buildGiftBanner.dataset.defaultColor;
    console.log(colorSchema, defaultColorBanner)
    if (!buildGiftBanner) return;
    if (colorSchema == defaultColorBanner) {
      return;
    }
    else {
      buildGiftBanner.classList.remove(`${defaultColorBanner}`);
      buildGiftBanner.classList.add(`${colorSchema}`);
    }
  }

  renderPackageList(button) {
    const ulElement = document.getElementById('buildGift__package');
    if (!ulElement) return;

    const listPackage = button.closest('.buildGift__type').querySelectorAll('[data-collection-packaging]')
    
    listPackage.forEach((element) => { 
      const liElement = this.renderPackageElement(element, element.getAttribute('data-collection'));
      ulElement.appendChild(liElement);
    });
  }

  renderPackageElement (element, elementIndex) {
    if (!element) return;
    const templateElement = document.getElementById("giftPackageItem");
    if (!templateElement) return;
    const packageElement = templateElement.content.firstElementChild.cloneNode(true);
    if (!packageElement) return;

    const ProductPackageData = element.querySelectorAll('[type="application/json"]');

    // set Default package
    const url = new URL(window.location);
    const rootUrl = url.origin;
    const firstItemAvai = Array.from(ProductPackageData).find((element) => {
      const product = JSON.parse(element.textContent);
      if (product.available) {
        return element;
      }
    });

    if (firstItemAvai) {
      const product = JSON.parse(firstItemAvai.textContent);
      packageElement.querySelector('img').src = product.images;
      packageElement.querySelector('.buildGift__package-link').href = `${rootUrl}/products/${ product.handle }`;
      packageElement.querySelector('.buildGift__package-title').textContent = product.title;
      packageElement.querySelector('.price').textContent = firstItemAvai.getAttribute('data-price');
    }
    
    // render listPackage
    ProductPackageData.forEach((item, index) => {
      const product = JSON.parse(item.textContent);

      let inputField= document.createElement("span");
      let inputElement = document.createElement("INPUT");
      let labelElement = document.createElement("label");
      inputElement.setAttribute("type", "radio");
      inputElement.setAttribute("name", `${elementIndex}`);
      inputElement.setAttribute("id", `${product.variants[0].id}`);
      inputElement.setAttribute("data-title", `${product.title}`);
      inputElement.setAttribute("data-media", `${product.images[0]}`);
      inputElement.setAttribute("data-url", `/products/${product.handle}`);
      inputElement.setAttribute("data-price", item.getAttribute('data-price'));
      inputElement.setAttribute("data-package-select","");
      if (product.tags.includes('monogram_bag')) {
        inputElement.setAttribute("data-package", `monogram-bag`);
      }

      labelElement.style.backgroundImage = `url(${product.images[0]})`;
      labelElement.setAttribute("for", `${product.variants[0].id}`);

      if (!product.available) {
        inputElement.disabled = true;
        labelElement.style.opacity = "0.2";
        labelElement.style.cursor = "not-allowed";
      }

      inputField.appendChild(inputElement);
      inputField.appendChild(labelElement);
      packageElement.querySelector('.buildGift__package-input').appendChild(inputField);
      packageElement.querySelector('.buildGift__package-input').querySelector('input').checked = true;
    })
    
    return packageElement;
  }

  updatePackage(e, dataSetPackage) {
    const mediaElement = e.closest('.js-buildGift__package-item').querySelector("img");
    const priceElement = e.closest('.js-buildGift__package-item').querySelector(".price");
    const titleElement = e.closest('.js-buildGift__package-item').querySelector(".buildGift__package-title");
    const linkElement = e.closest('.js-buildGift__package-item').querySelector(".buildGift__package-link");

    if (mediaElement && priceElement && titleElement && linkElement) {
      mediaElement.src = dataSetPackage.src;
      linkElement.href = dataSetPackage.url;
      priceElement.textContent = dataSetPackage.price;
      titleElement.textContent = dataSetPackage.title;
    }
  }

  setMonogramProduct(e) {
    const inputElement = e.target.closest('.js-buildGift__package-item').querySelector("input[type=radio]:checked");
    const monogramImage = this.querySelector('.js-monogram-img');
    const monogramInput = document.querySelector('[data-packaging-gift]');
    if(!inputElement || !monogramImage || !monogramInput) return;
    monogramImage.setAttribute("data-style-package", inputElement.getAttribute('data-package'))
    monogramImage.querySelector('img').src = inputElement.getAttribute('data-media');
    monogramInput.value = inputElement.id;
  }

  setMonogramText(e) {
    if (!this.monogramText) return;

    if (e.target.id == 'monogramText') {
      let lng = e.target.value.trim();
      this.monogramText.style.display = 'block';
      this.monogramText.textContent = e.target.value;
      this.monogramText.classList.remove("fs-13", "fs-18", "fs-24", "fs-32", "fs-48");

      if (lng.length >= 20 && lng.length <= 30) {
        this.monogramText.classList.add("fs-13");
      } else if (lng.length >= 15 && lng.length < 20) {
        this.monogramText.classList.add("fs-18");
      } else if (lng.length >= 10 && lng.length < 15) {
        this.monogramText.classList.add("fs-24");
      } else if (lng.length >= 5 && lng.length < 10) {
        this.monogramText.classList.add("fs-32");
      } else if (lng.length >= 0 && lng.length < 5) {
        this.monogramText.classList.add("fs-48");
      }

      this.querySelector(".charcount").textContent = lng.length;

      if (!document.getElementById('monogram_text')) return;
      document.getElementById('monogram_text').value = e.target.value;
      if (!document.getElementById('monogram_style')) return;
      document.getElementById('monogram_style').value = e.target.closest('.buildGift__monogram--action').querySelector('#monogramFont').value;
    }
  }

  setMonogramFont (e) {
    if (e.target.id == 'monogramFont') {
      const monogramFontElement = e.target.closest('.buildGift__monogram--action').querySelector('#monogramText');
      this.monogramText.classList.remove('font-classic', 'font-playful', 'font-bold', 'font-stylish', 'font-fancy');
      this.monogramText.classList.add(`font-${e.target.value}`);
      if (!document.getElementById('monogram_style')) return
      if(monogramFontElement && monogramFontElement.value.trim().length > 0) {
        document.getElementById('monogram_style').value = e.target.value;
      }
    }
  }

  renderCollectionGift(collection) {
    const url = `${window.location.origin}/collections/${collection}`;
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        const html = responseText;
        const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
        const collectionGiftFill = this.querySelector('.js-buildGift__fillGift');
        collectionGiftFill.innerHTML = parsedHTML.querySelector('.js-collection-fillGift').innerHTML;
        setTimeout(() => {
          const products_on_page = document.querySelector('.js-buildGift__fillGift .product-grid');
          let totalPage = Number(products_on_page.dataset.pageSize);  
          const load_more_btn = document.querySelector('.js-buildGift__fillGift .load-more_btn');

          if (totalPage > 1 && load_more_btn) {
            load_more_btn.style.display = 'block';
          }   
          
        }, 500);
      });
  }

  setProductFillGift(e, count) {
    const inputFillGift = document.querySelector('.js-buildGift__input');
    if (!inputFillGift) return;
    let inputQuantity = document.createElement("INPUT");
    let inputProductId = document.createElement("INPUT");
    inputQuantity.setAttribute("type", "hidden");
    inputQuantity.setAttribute("name", `items[${count}][quantity]`);
    inputQuantity.setAttribute("value", '1');
    inputProductId.setAttribute("type", "hidden");
    inputProductId.setAttribute("name", `items[${count}][id]`);
    inputProductId.setAttribute("value", `${e.target.dataset.product}`);

    inputFillGift.appendChild(inputQuantity);
    inputFillGift.appendChild(inputProductId);
  }

  cloneMonogramImage(e) {
    const monogramImageMessage = this.querySelector('.js-cardMessage-img');
    if (!monogramImageMessage) return;
    monogramImageMessage.innerHTML = e.target.closest('.js-buildGift__monogram').querySelector('.js-monogram-img').outerHTML;
  }

  updateUrl(currentStep) {
    const url = new URL(window.location);
    const href = url.href;
    const nextStep = Number(currentStep) + 1;
    let newUrl, urlSet;

    if(href.includes('step-')){
      let splitUrl = href.split('step')[0]
      if (splitUrl.endsWith("/")) {
        newUrl = splitUrl.slice(0, -1);
      }
      else {
        newUrl = splitUrl;
      }
    }
    else{
      if (href.endsWith("/")) {
        newUrl = href.slice(0, -1);
      }
      else {
        newUrl = href;
      }
    }

    urlSet = `${newUrl}/step-${nextStep}`
    history.replaceState({ }, '',urlSet);
  }

  updateStatus(currentStep, parents) {
      parents.classList.remove('active');
      parents.nextElementSibling.classList.add('active');
      document.querySelector(`[data-progress= "${currentStep}"]`).classList.remove('current');
      document.querySelector(`[data-progress= "${currentStep}"]`).classList.add('pass');
      document.querySelector(`[data-progress= "${currentStep}"]`).nextElementSibling.classList.add('current'); 
      document.querySelector(`[data-progress-mobile= "${currentStep}"]`).classList.remove('current');
      document.querySelector(`[data-progress-mobile= "${currentStep}"]`).nextElementSibling.classList.add('current'); 
      
      window.scrollTo({
        top: 0, 
        left: 0, 
        behavior: 'smooth'
      });
  }

  getCartConfig() {
    function getCartConfig() { 
      if (!this.config) return false;
      this.config = JSON.parse(this.config.innerHTML || '{}');
    }
  }
    
  moneyFormat (cents, format) {
    const moneyFormat = '${{amount}}';

    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    let value = '';
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    const formatString = format || moneyFormat;

    function formatWithDelimiters(
      number,
      precision = 2,
      thousands = ',',
      decimal = '.'
    ) {
      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      const parts = number.split('.');
      const dollarsAmount = parts[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        `$1${thousands}`
      );
      const centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }
}

customElements.define('build-gift', BuildGift);

// loadmore collection fill gift
let nextPageNum = 1;

async function getNextPage(next_url) {
  try {
    let res = await fetch(next_url);
    return await res.text();
  } catch (error) {
    console.log(error);
  }
}

async function loadMoreProducts() {
  const products_on_page = document.querySelector('.js-buildGift__fillGift .product-grid');
  const load_more_btn = document.querySelector('.js-buildGift__fillGift .load-more_btn');
  const load_more_spinner = document.querySelector('.js-buildGift__fillGift .load-more_spinner');
  if (!products_on_page || !load_more_btn || !load_more_spinner) {
    return
  }

  let totalPage = Number(products_on_page.dataset.pageSize)
  let collection = products_on_page.dataset.collection;
  let next_url;
  if(nextPageNum < totalPage) {
    load_more_spinner.style.display = 'block';
    nextPageNum += 1;
    next_url = `/collections/${collection}?page=${nextPageNum}`;

    let nextPage = await getNextPage(next_url);
    const parser = new DOMParser();
    const nextPageDoc = parser.parseFromString(nextPage, 'text/html');
  
    const productgrid = nextPageDoc.getElementById('product-grid');
    const new_products = productgrid.getElementsByClassName('grid__item');
    
    load_more_spinner.style.display = 'none';

    for (let i = 0; i < new_products.length; i++) {
      let single_product = new_products[i].cloneNode(true);
      products_on_page.appendChild(single_product);
    }

    if (nextPageNum == totalPage) {
      load_more_btn.style.display = 'none';
    }
  }
}
