import 'dotenv/config';
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const MEDIA_FOLDER = process.env.HOME_GALLERY_FOLDER;

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

function findFiles(prefix) {
  const all = fs.readdirSync(MEDIA_FOLDER);
  const matches = all.filter(
    (f) => f.startsWith(prefix) && /\.(jpg|jpeg|png)$/i.test(f)
  );
  matches.sort(); // "_01", "_02", ... sorts correctly as strings
  return matches.map((f) => path.join(MEDIA_FOLDER, f));
}

async function uploadImage(filePath) {
  const stream = fs.createReadStream(filePath);
  const asset = await client.assets.upload('image', stream, {
    filename: path.basename(filePath),
  });
  return asset;
}

function randomKey() {
  return Math.random().toString(36).slice(2, 10);
}

async function buildGalleryItems(prefix, label) {
  const files = findFiles(prefix);
  console.log(`  Found ${files.length} files for "${label}"`);
  const items = [];
  for (const f of files) {
    const asset = await uploadImage(f);
    items.push({
      _type: 'galleryPhoto',
      _key: randomKey(),
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      },
    });
    process.stdout.write('.');
  }
  console.log('');
  return items;
}

async function getOrCreateHomePageId() {
  const existingId = await client.fetch(`*[_type == "homePage"][0]._id`);
  if (existingId) {
    console.log(`Found existing Home Page document: ${existingId}`);
    return existingId;
  }
  console.log('No Home Page document found — creating a new one.');
  const created = await client.create({ _type: 'homePage' });
  return created._id;
}

// ----------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------

async function main() {
  if (!process.env.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN.includes('paste-your')) {
    console.error('ERROR: SANITY_API_TOKEN is not set in .env');
    process.exit(1);
  }
  if (!MEDIA_FOLDER || !fs.existsSync(MEDIA_FOLDER)) {
    console.error(`ERROR: HOME_GALLERY_FOLDER does not exist: ${MEDIA_FOLDER}`);
    process.exit(1);
  }

  const only = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1];
  // Usage: node import-home-galleries.js --only=previousWorks
  //        node import-home-galleries.js --only=workInProgress
  //        node import-home-galleries.js   (runs both)

  const homePageId = await getOrCreateHomePageId();

  if (!only || only === 'previousWorks') {
    console.log('\nUploading Previous Works photos...');
    const previousWorksItems = await buildGalleryItems('home-previous-works_', 'Previous Works');
    console.log('Appending Previous Works (separate commit)...');
    await client
      .patch(homePageId)
      .setIfMissing({ previousWorks: [] })
      .append('previousWorks', previousWorksItems)
      .commit();
    console.log(`Added ${previousWorksItems.length} Previous Works photos.`);
  }

  if (!only || only === 'workInProgress') {
    console.log('\nUploading Work in Progress photos...');
    const workInProgressItems = await buildGalleryItems('home-work-in-process_', 'Work in Progress');
    console.log('Appending Work in Progress (separate commit)...');
    await client
      .patch(homePageId)
      .setIfMissing({ workInProgress: [] })
      .append('workInProgress', workInProgressItems)
      .commit();
    console.log(`Added ${workInProgressItems.length} Work in Progress photos.`);
  }

  console.log('\nDone. Check the Studio to review, then publish the Home Page document.');
}

main().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
