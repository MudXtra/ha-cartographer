// Tests for copyText in wwwroot/js/realmShell.js (0.3.4, the person detail's Copy address button): true only once the clipboard accepted the text; false,
// never a rejection, for a refusal, a missing clipboard or nothing to copy. The clipboard is a fake passed in; the module touches no global when it is imported.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { armCopy, copyText, startCopy, takeCopy } from '../../src/Realm.Web/wwwroot/js/realmShell.js';

const ADDRESS = '123 Eastgate Ave, Pinebrook, AL';

/** A clipboard that records what it was given, and refuses it when `refuse` is set. */
function fakeClipboard(refuse = false) {
  /** @type {string[]} */
  const written = [];
  return {
    written,
    /** @param {string} text */
    async writeText(text) {
      if (refuse) throw new DOMException('Write permission denied.', 'NotAllowedError');
      written.push(text);
    },
  };
}

test('copyText writes the whole text and says it was copied', async () => {
  const clipboard = fakeClipboard();
  assert.equal(await copyText(ADDRESS, clipboard), true);
  assert.deepEqual(clipboard.written, [ADDRESS]);
});

test('copyText says false, and does not reject, when the browser refuses the write', async () => {
  const clipboard = fakeClipboard(true);
  assert.equal(await copyText(ADDRESS, clipboard), false);
  assert.deepEqual(clipboard.written, []);
});

test('copyText says false without the asynchronous clipboard (an insecure origin, an old WebView)', async () => {
  assert.equal(await copyText(ADDRESS, undefined), false);
  assert.equal(await copyText(ADDRESS, {}), false);
});

test('copyText writes nothing for an empty or missing text', async () => {
  const clipboard = fakeClipboard();
  assert.equal(await copyText('', clipboard), false);
  assert.equal(await copyText(null, clipboard), false);
  assert.deepEqual(clipboard.written, []);
});

test('copyText reads navigator.clipboard when no clipboard is passed, and says false when there is none', async () => {
  const had = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const clipboard = fakeClipboard();
  try {
    Object.defineProperty(globalThis, 'navigator', { value: { clipboard }, configurable: true });
    assert.equal(await copyText(ADDRESS), true);
    assert.deepEqual(clipboard.written, [ADDRESS]);

    Object.defineProperty(globalThis, 'navigator', { value: {}, configurable: true });
    assert.equal(await copyText(ADDRESS), false);
  } finally {
    if (had) Object.defineProperty(globalThis, 'navigator', had);
    else delete globalThis.navigator;
  }
});

/** A copy button that carries `text`, and a click event on it. */
function clickOn(text) {
  const button = { getAttribute: (/** @type {string} */ name) => (name === 'data-copy-text' ? text : null) };
  return { button, event: { target: { closest: () => button } } };
}

test('startCopy writes during the click itself, and takeCopy gives that write\'s answer', async () => {
  const clipboard = fakeClipboard();
  const { button, event } = clickOn(ADDRESS);
  startCopy(event, clipboard);
  assert.deepEqual(clipboard.written, [ADDRESS], 'written before anything was awaited');

  const later = fakeClipboard();
  assert.equal(await takeCopy(button, ADDRESS, later), true);
  assert.deepEqual(later.written, [], 'no second write');
});

test('takeCopy gives a refused write\'s answer, and answers each click once, oldest first', async () => {
  const refusing = fakeClipboard(true);
  const { button, event } = clickOn(ADDRESS);
  startCopy(event, refusing);
  startCopy(event, fakeClipboard());
  assert.equal(await takeCopy(button, ADDRESS, fakeClipboard()), false);
  assert.equal(await takeCopy(button, ADDRESS, fakeClipboard()), true);
});

test('takeCopy writes now for a button whose click started nothing (not armed yet)', async () => {
  const clipboard = fakeClipboard();
  const { button } = clickOn(ADDRESS);
  assert.equal(await takeCopy(button, ADDRESS, clipboard), true);
  assert.deepEqual(clipboard.written, [ADDRESS]);
});

test('takeCopy says null and writes nothing when the click wrote another address, or the button is gone', async () => {
  const clipboard = fakeClipboard();
  const { button, event } = clickOn('somewhere else');
  startCopy(event, fakeClipboard());
  assert.equal(await takeCopy(button, ADDRESS, clipboard), null);
  assert.equal(await takeCopy(null, ADDRESS, clipboard), null);
  assert.deepEqual(clipboard.written, []);
});

test('startCopy ignores a click outside a copy button', () => {
  const clipboard = fakeClipboard();
  startCopy({ target: { closest: () => null } }, clipboard);
  startCopy({ target: null }, clipboard);
  assert.deepEqual(clipboard.written, []);
});

test('armCopy puts one click listener on the button, however often it is called', () => {
  /** @type {string[]} */
  const added = [];
  const button = { addEventListener: (/** @type {string} */ type) => added.push(type) };
  armCopy(/** @type {any} */ (button));
  armCopy(/** @type {any} */ (button));
  armCopy(null);
  assert.deepEqual(added, ['click']);
});
