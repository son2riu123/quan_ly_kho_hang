const fs = require('fs');
const path = require('path');

const xmlPath = 'C:\\Users\\Admin\\Downloads\\pttk_temp\\word\\document.xml';
if (!fs.existsSync(xmlPath)) {
  console.error('File not found:', xmlPath);
  process.exit(1);
}

const content = fs.readFileSync(xmlPath, 'utf8');

// Trích xuất các đoạn văn bản trong thẻ <w:t>
const regex = /<w:t[^>]*>(.*?)<\/w:t>/g;
let match;
const paragraphs = [];
let currentText = '';

// Để đơn giản, gom tất cả thẻ w:t thành các cụm văn bản
// w:p là paragraph, chứa nhiều w:r chứa w:t
// Ta sẽ split theo <w:p> để có các đoạn độc lập
const pBlocks = content.split(/<\/w:p>/);
const lines = pBlocks.map(pBlock => {
  let text = '';
  let m;
  const tRegex = /<w:t[^>]*>(.*?)<\/w:t>/g;
  while ((m = tRegex.exec(pBlock)) !== null) {
    text += m[1];
  }
  return text.trim();
}).filter(t => t.length > 0);

fs.writeFileSync('C:\\Users\\Admin\\Downloads\\pttk_clean_text.txt', lines.join('\n'), 'utf8');
console.log('Clean text written successfully. Total lines:', lines.length);
