class LoadingIndicator extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
            .loading-container {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.8);
                z-index: 9999;
                justify-content: center;
                align-items: center;
            }
            .loading-text {
                font-size: 24px;
                color: #333;
            }
        `;
    this.shadowRoot.appendChild(style);

    const loadingContainer = document.createElement('div');
    loadingContainer.classList.add('loading-container');
    const loadingText = document.createElement('p');
    loadingText.classList.add('loading-text');
    loadingText.textContent = 'Loading...';
    loadingContainer.appendChild(loadingText);
    this.shadowRoot.appendChild(loadingContainer);
  }

  show() {
    this.shadowRoot.querySelector('.loading-container').style.display = 'flex';
  }

  hide() {
    this.shadowRoot.querySelector('.loading-container').style.display = 'none';
  }
}

customElements.define('loading-indicator', LoadingIndicator);

const loadingIndicator = document.querySelector('loading-indicator');

function simulateLoading() {
  loadingIndicator.show();

  setTimeout(() => {
    loadingIndicator.hide();
  }, 2000);
}

simulateLoading();
