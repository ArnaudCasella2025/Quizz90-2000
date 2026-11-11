// Petits utilitaires d'interface.
import { CATEGORIES } from './config.js?v=20261111093305';

export function h(tag, props, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'html') el.innerHTML = v;
    else if (k in el && typeof v !== 'string') el[k] = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  append(el, children);
  return el;
}
function append(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

export const img = (name, cls, alt = '') => h('img', { src: `assets/img/${name}.webp`, class: cls, alt, draggable: 'false' });

export const fmt = (n) => (n || 0).toLocaleString('fr-FR');

export function medal(pos) {
  return pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : `${pos}.`;
}

export function catLabel(cat) {
  const c = CATEGORIES[cat];
  return c ? `${c.emoji} ${c.label}` : '';
}
export const DIFF = { 1: '🟢 Facile', 2: '🟠 Moyen', 3: '🔴 Difficile' };

let toastTimer;
export function toast(msg, ms = 2600) {
  let t = document.getElementById('toast');
  if (!t) { t = h('div', { id: 'toast', role: 'status' }); document.body.append(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), ms);
}

export function avatarEl(avatar, cls = '') {
  return h('span', { class: `avatar ${cls}` }, avatar || '⭐');
}

export function qrCodeSvg(text, cell = 4) {
  // global `qrcode` fourni par vendor/qrcode.js
  const qr = window.qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  return qr.createSvgTag({ cellSize: cell, margin: 2, scalable: true });
}

export function segmented(options, value, onChange) {
  const wrap = h('div', { class: 'seg', role: 'radiogroup' });
  const render = () => {
    wrap.replaceChildren(...options.map(([v, label]) => h('button', {
      type: 'button', class: 'seg-btn' + (String(v) === String(value) ? ' on' : ''),
      role: 'radio', 'aria-checked': String(String(v) === String(value)),
      onclick: () => { value = v; render(); onChange(v); },
    }, label)));
  };
  render();
  return wrap;
}

export function toggle(label, checked, onChange) {
  const input = h('input', { type: 'checkbox', checked, onchange: () => onChange(input.checked) });
  return h('label', { class: 'toggle' }, input, h('span', { class: 'toggle-ui' }), h('span', {}, label));
}
