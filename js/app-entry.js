import { RECIPES } from '../recipes.js';
import { AppV2 } from './components/AppV2.js';

window.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('root');
    if (!rootElement) return;

    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(AppV2, { recipes: RECIPES }));
});
