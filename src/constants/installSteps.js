export const INSTALL_STEPS = {
  Chrome: [
    {
      number: '1',
      title: 'Open Extensions',
      description: 'Open Chrome and navigate to:',
      code: 'chrome://extensions',
      extra: 'Enable "Developer mode" using the toggle in the top-right corner.',
    },
    {
      number: '2',
      title: 'Unzip the file',
      description: 'Download and unzip the generated .zip file to a folder on your desktop.',
      code: null,
      extra: 'You should see manifest.json inside the extracted folder.',
    },
    {
      number: '3',
      title: 'Load unpacked',
      description: 'Click "Load unpacked" and select the unzipped extension folder.',
      code: null,
      extra: 'Your extension is now installed and active.',
    },
  ],
  Firefox: [
    {
      number: '1',
      title: 'Open Debugging',
      description: 'Open Firefox and navigate to:',
      code: 'about:debugging#/runtime/this-firefox',
      extra: '',
    },
    {
      number: '2',
      title: 'Unzip the file',
      description: 'Download and unzip the generated .zip file to a folder on your desktop.',
      code: null,
      extra: 'You should see manifest.json inside the extracted folder.',
    },
    {
      number: '3',
      title: 'Load Temporary Add-on',
      description: 'Click "Load Temporary Add-on…" and select the manifest.json file inside the unzipped folder.',
      code: null,
      extra: 'Your extension is now installed for this session.',
    },
  ],
  Edge: [
    {
      number: '1',
      title: 'Open Extensions',
      description: 'Open Edge and navigate to:',
      code: 'edge://extensions',
      extra: 'Enable "Developer mode" using the toggle on the left sidebar.',
    },
    {
      number: '2',
      title: 'Unzip the file',
      description: 'Download and unzip the generated .zip file to a folder on your desktop.',
      code: null,
      extra: 'You should see manifest.json inside the extracted folder.',
    },
    {
      number: '3',
      title: 'Load unpacked',
      description: 'Click "Load unpacked" and select the unzipped extension folder.',
      code: null,
      extra: 'Your extension is now installed and active.',
    },
  ]
};
