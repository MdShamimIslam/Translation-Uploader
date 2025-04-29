import { render } from '@wordpress/element';
import App from './App';

document.addEventListener('DOMContentLoaded', function () {
  const root = document.getElementById('translation-uploader-root');
  if (root) {
    render(<App />, root);
  }
});


// import { createRoot } from 'react-dom/client';
// import App from './App';

// const container = document.getElementById('translation-uploader-admin');
// const root = createRoot(container);
// root.render(<App />);
