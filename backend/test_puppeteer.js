const puppeteer = require('puppeteer');

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security'
    ]
  });
  const page = await browser.newPage();
  
  // Set realistic user agent and headers
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setExtraHTTPHeaders({
    'accept-language': 'en-US,en;q=0.9',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'upgrade-insecure-requests': '1'
  });
  await page.setViewport({ width: 1366, height: 768 });

  // Direct Justdial URL
  const jdUrl = `https://www.justdial.com/Hyderabad/Wizard-Entertainment-Anjaiah-Nagar-Near-Radisson-Hotel-Gachibowli/040PXX40-XX40-170327163117-F2K8_BZDET`;
  console.log(`Navigating directly to Justdial: ${jdUrl}`);
  
  try {
    const response = await page.goto(jdUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log(`Status code: ${response.status()}`);
    
    console.log('Waiting 5s...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const title = await page.title();
    console.log('Page Title:', title);

    const bodySnippet = await page.evaluate(() => document.body.innerText.slice(0, 500));
    console.log('Body snippet:', bodySnippet);
    
    // Find all images
    const images = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || img.getAttribute('data-original'),
        class: img.className,
        alt: img.alt
      }));
    });
    console.log(`Found ${images.length} images:`);
    console.log(images.slice(0, 30));
    
    // Let's also look for any links containing image extensions or source tags
    const otherMedia = await page.evaluate(() => {
      const urls = [];
      document.querySelectorAll('source').forEach(s => {
        if (s.srcset) urls.push(s.srcset);
      });
      document.querySelectorAll('a').forEach(a => {
        if (a.href && (a.href.includes('.jpg') || a.href.includes('.png') || a.href.includes('.jpeg'))) {
          urls.push(a.href);
        }
      });
      return urls;
    });
    console.log(`Found ${otherMedia.length} other media elements:`, otherMedia.slice(0, 10));

  } catch (err) {
    console.error('Error:', err);
  }

  await browser.close();
}

run();
