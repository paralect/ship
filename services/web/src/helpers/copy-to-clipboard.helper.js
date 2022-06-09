export default function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.clip = 'rect(0, 0, 0, 0)';
  textarea.textContent = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}
