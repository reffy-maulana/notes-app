class InputForm extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _submitEvent = 'submit';

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');

    this.render();
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = '';
  }

  connectedCallback() {
    const form = this._shadowRoot.querySelector('form');
    form.addEventListener('submit', (event) => this._onFormSubmit(event, this));

    const inputs = this._shadowRoot.querySelectorAll('input, textarea');
    inputs.forEach((input) => {
      input.addEventListener('input', () => this._validateInput(input));
    });
  }

  disconnectedCallback() {
    const form = this._shadowRoot.querySelector('form');
    form.removeEventListener('submit', (event) => this._onFormSubmit(event, this));
  }

  _onFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach((input) => {
      if (!input.checkValidity()) {
        isValid = false;
        this._validateInput(input);
      }
    });

    if (isValid) {
      const formData = new FormData(form);
      const noteTitle = formData.get('noteTitle');
      const noteContent = formData.get('noteContent');
      const datetime = formData.get('datetime');

      this.dispatchEvent(
        new CustomEvent(this._submitEvent, {
          detail: { noteTitle, noteContent, datetime },
          bubbles: true,
        })
      );

      this._resetForm();
    }
  }

  _resetForm() {
    const form = this._shadowRoot.querySelector('form');
    form.reset();
  }

  _validateInput(input) {
    if (input.validity.valid) {
      input.classList.remove('invalid');
    } else {
      input.classList.add('invalid');
    }
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
            <div class="input-form">
              <form id="inputForm">
                <label for="noteTitle">Note Title: </label>
                <input type="text" name="noteTitle" id="noteTitle" placeholder="Insert note title here..." required />
      
                <label for="noteContent">Note Content: </label>
                <textarea name="noteContent" id="noteContent" cols="30" rows="10" required></textarea>
      
                <label for="datetime">Date & Time Created: </label>
                <input type="datetime-local" name="datetime" id="datetime" required />
      
                <button type="submit">Submit</button>
              </form>
            </div>
          `;
  }

  _updateStyle() {
    this._style.textContent = `
            .input-form {
              max-width: 800px;
              margin: 0 auto;
              margin-block: 2rem;
              padding: 2rem;
              background-color: var(--secondary);
              border-radius: 20px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
      
            .input-form label {
              color: var(--dark);
              font-size: 1.5rem;
              margin-block: 0.5rem;
            }
      
            .input-form input, .input-form textarea {
              width: 95%;
              font-weight: 500;
              font-size: 1.5rem;
              color: var(--dark);
              background-color: var(--light);
              padding: 1rem;
              margin-block: 0.5rem;
              border-radius: 8px;
              border: none;
            }
      
            .input-form button {
              background-color: var(--primary);
              color: var(--dark);
              font-weight: 700;
              width: 100%;
              height: 40px;
              margin-top: 1rem;
              border-radius: 20px;
              font-size: 1rem;
            }
      
            .input-form button:hover,
            .input-form button:active {
              background-color: var(--secondary);
              border: 3px solid var(--primary);
            }
  
            .input-form input.invalid,
            .input-form textarea.invalid {
              border: 2px solid red;
            }
          `;
  }
}

customElements.define('input-form', InputForm);
