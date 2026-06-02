const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'src', '__tests__', 'contexts'),
  path.join(__dirname, 'src', '__tests__', 'pages'),
  path.join(__dirname, 'src', '__tests__', 'services'),
];

dirs.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  console.log(`Created: ${dir}`);
});
