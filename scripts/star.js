window.FavoriteStarElement = (function() {
    var currentScript = document._currentScript || document.currentScript,
      doc = currentScript.ownerDocument,
      proto = Object.create(HTMLElement.prototype);
    proto.createdCallback = function() {
      var template = doc.querySelector('template'),
        clone = document.importNode(template.content, true);
      this.shadowRoot = this.createShadowRoot();
      this.shadowRoot.appendChild(clone);
      this.element = this.shadowRoot.querySelector('.favorite-star-character');
      this.boundOnClick = this.onClick.bind(this);
      this.boundOnMouseover = this.onMouseover.bind(this);
      this.boundOnMouseout = this.onMouseout.bind(this);
      if (this.hasAttribute('active')) {
        this.element.setAttribute('active', '');
      }
    };
    proto.toggle = function() {
      if (this.hasAttribute('active')) {
        this.removeAttribute('active');
      }
      else {
        this.setAttribute('active', '');
      }
    }
    proto.onClick = function() {
      this.toggle();
    }
    proto.onMouseover = function() {
      var el = this.element;
      if (!el.hasAttribute('active')) {
        el.setAttribute('hover', '');
      }
    }
    proto.onMouseout = function() {
      var el = this.element;
      el.removeAttribute('hover');
    }
    proto.attachedCallback = function() {
      var el = this.element;
      el.addEventListener('click', this.boundOnClick);
      el.addEventListener('mouseout', this.boundOnMouseout);
      el.addEventListener('mouseover', this.boundOnMouseover);
    }
    proto.detachedCallback = function() {
      var el = this.element;
      el.removeEventListener('click', this.boundOnClick);
      el.removeEventListener('mouseout', this.boundOnMouseout);
      el.removeEventListener('mouseover', this.boundOnMouseover);
    }
    proto.attributeChangedCallback = function(attr) {
      if (attr === 'active') {
        var el = this.element;
        if (this.hasAttribute('active')) {
          el.setAttribute('active', '');
        }
        else {
          el.removeAttribute('active');
          el.removeAttribute('hover');
        }
      }
    }
    return document.registerElement('favorite-star', {prototype: proto});
  })();