export function show() {
  const loader = document.querySelector('#loader');
  loader.style.display = 'flex';
}

export function hide() {
  const loader = document.querySelector('#loader');
  loader.style.display = 'none';
}
