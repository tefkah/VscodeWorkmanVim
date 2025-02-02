import * as assert from 'assert';
import * as srcConfiguration from '../../src/configuration/configuration';
import * as testConfiguration from '../testConfiguration';
import { cleanUpWorkspace, setupWorkspace } from './../testUtils';
import { Mode } from '../../src/mode/mode';
import { newTest } from '../testSimplifier';

suite('Configuration', () => {
  const configuration = new testConfiguration.Configuration();
  configuration.leader = '<space>';
  configuration.normalModeKeyBindingsNonRecursive = [
    {
      before: ['leader', 'l'],
      after: ['l', 'eSc', 'e'],
    },
    {
      before: ['<leader>', 'f', 'e', 's'],
      after: ['v'],
    },
  ];
  configuration.whichwrap = 'h,l';

  setup(async () => {
    await setupWorkspace(configuration);
  });

  teardown(cleanUpWorkspace);

  test('remappings are normalized', async () => {
    const normalizedKeybinds = srcConfiguration.configuration.normalModeKeyBindingsNonRecursive;
    const normalizedKeybindsMap = srcConfiguration.configuration.normalModeKeyBindingsMap;
    const testingKeybinds = configuration.normalModeKeyBindingsNonRecursive;

    assert.strictEqual(normalizedKeybinds.length, testingKeybinds.length);
    assert.strictEqual(normalizedKeybinds.length, normalizedKeybindsMap.size);
    assert.deepStrictEqual(normalizedKeybinds[0].before, [' ', 'l']);
    assert.deepStrictEqual(normalizedKeybinds[0].after, ['l', '<Esc>', 'e']);
  });

  newTest({
    title: 'Can handle long key chords',
    start: ['|'],
    // <leader>fes
    keysPressed: ' fes',
    end: ['|'],
    endMode: Mode.Visual,
  });
});
