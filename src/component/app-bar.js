class AppBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
          :host {
            color: var(--dark);
            background-color: var(--secondary);
            padding: 1rem;
          }
  
          h1 {
            text-align: centerl
            font-size: 2rem;
            font-weight: 700;
            margin: 0;
          }
        </style>
        <h1>Notes App</h1>
      `;
  }
}

customElements.define('app-bar', AppBar);
