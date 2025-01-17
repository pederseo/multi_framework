import {renderMain} from '../js/components/mainContent.js';
import { renderNav } from './components/navContent.js';



document.addEventListener("DOMContentLoaded", () => {
    const nav = document.getElementById("nav-content");
    const main = document.getElementById("main-content");

    renderNav(nav, main);

    renderMain(nav, main);
});