import '../style.css';
import './starfield';
import { animateSnakeBorder } from './snakeBorder';

document.addEventListener('DOMContentLoaded', () => {
  const frameElement = document.querySelector('.frame') as HTMLElement;
  if (frameElement) {
    animateSnakeBorder(frameElement);
  }
});
