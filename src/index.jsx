import { createRoot } from '@wordpress/element';
import App from './App';

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('translation-uploader-root');
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  }
});



