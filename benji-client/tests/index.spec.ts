import { test, expect, chromium } from '@playwright/test';
import { email, password, loggedIn } from './config';

test.beforeAll(async () => {
  if (loggedIn) {
    return;
  }
  console.log('Log In Needed');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(
    'https://discord.com/api/oauth2/authorize?client_id=712958072007688232&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000/login&response_type=code&scope=identify%20guilds'
  );

  await page.locator('[aria-label="Email or Phone Number"]').fill(email);
  await page.waitForTimeout(500);
  await page.locator('[aria-label="Password"]').fill(password);
  await page.waitForTimeout(500);
  await page.click('text=Login');
  await page.waitForNavigation();

  await page.locator('button', { hasText: 'Authorize' }).click();
  await page.waitForNavigation();

  await expect(page.locator('.InactiveGuild_prompt__zovlt > h1')).toHaveText(
    'Select a server to start!'
  );
  console.log('Logged in Successfully. Saving state...');

  //Save storage state into the file.
  await context.storageState({ path: 'tests/state.json' });
});

test('Add song and check that count increases', async ({ browser }) => {
  const context = await browser.newContext({
    storageState: 'tests/state.json',
  });
  const page = await context.newPage();
  await page.goto('http://localhost:3000');

  // Select server
  await page.locator('.Navbar_guildIcon__2hzyH ').click();

  // Check if channel select exists
  if ((await page.locator('.Selection_active__2gr1w').count()) > 0) {
    await page.locator('text=General').click();
  } else {
    console.log('Channel was pre-selected');
  }

  const queueLength = await page.locator('.Queue_queue__item__1KnmH').count();
  await page.locator('[placeholder="Add a song!"]').fill('crab rave');
  await page.locator('.Search_search__icon__1LujX').click();
  await page.locator('.Search_search__item__WwDzH:first-child').click();
  await page.waitForTimeout(500);
  const newQueueLength = await page
    .locator('.Queue_queue__item__1KnmH')
    .count();

  test.fail(newQueueLength != queueLength + 1);
});
