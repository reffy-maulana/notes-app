class FooterBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
          :host {
            text-align: center;
            background-color: var(--secondary);
            padding: 1rem;
            font-weight: 700;
          }
          
          p {
            margin: 0;
          }
        </style>
        
        <p>Reffy Maulana || Notes App</p>
      `;
  }
}

customElements.define('footer-bar', FooterBar);
