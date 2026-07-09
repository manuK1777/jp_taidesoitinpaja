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

const MEDIA_FOLDER = process.env.MEDIA_FOLDER;

// ----------------------------------------------------------------------
// 1. Instrument data — one entry per remaining instrument.
//    "filePrefix" must match the filename prefix used during extraction
//    (e.g. "doshpuluur-3sd_photo01.png", "doshpuluur-3sd_video1.mp4").
//    "categoryTitle" must exactly match the title of the Instrument
//    Category document you already created manually in the Studio.
// ----------------------------------------------------------------------
const instruments = [
  {
    name: 'Doshpuluur 3SD',
    categoryTitle: 'Doshpuluur',
    filePrefix: 'doshpuluur-3sd',
    price: 570,
    availability: 'in-stock',
    shortDescription: 'A traditional 3-string Doshpuluur in flamed birch.',
    specifications: [
      { label: 'Neck & body', value: 'Flamed birch' },
      { label: 'Soundboard', value: 'goatskin' },
      { label: 'Back', value: 'goatskin' },
      { label: 'Strings', value: '3' },
    ],
  },
  {
    name: 'Doshpuluur 2SD',
    categoryTitle: 'Doshpuluur',
    filePrefix: 'doshpuluur-2sd',
    price: 550,
    availability: 'in-stock',
    shortDescription: 'A 2-string Doshpuluur with decorative top-skin elements.',
    specifications: [
      { label: 'Neck', value: 'Flamed birch' },
      { label: 'Body', value: 'Mahogany' },
      { label: 'Soundboard', value: 'Double goatskin (front + back)' },
      { label: 'Decoration', value: 'Decorative top-skin elements' },
    ],
    uniqueDetails: '3-stringed and 4-stringed versions available upon request.',
  },
  {
    name: 'ProIgil 5.0 BHR (100-yr Pine, Special Edition)',
    categoryTitle: 'ProIgil',
    filePrefix: 'proigil-5-0-bhr',
    price: 820,
    availability: 'in-stock',
    shortDescription: 'Special Edition Igil crafted from 100-year-old pine, with mechanical tuners.',
    specifications: [
      { label: 'Body & neck', value: '100-year-old pine' },
      { label: 'Soundboard', value: 'Goat skin' },
      { label: 'Tuners', value: 'Mechanical' },
      { label: 'Strings', value: 'Nylon' },
    ],
  },
  {
    name: 'Air-Tunable Frame Drum',
    categoryTitle: 'Air-Tunable Frame Drum',
    filePrefix: 'air-tunable-frame-drum',
    price: 370,
    availability: 'in-stock',
    shortDescription: 'A 55cm air-tunable frame drum, includes drumstick.',
    specifications: [
      { label: 'Membrane', value: 'Air-tunable' },
      { label: 'Diameter', value: '55 cm' },
      { label: 'Depth', value: '10 cm' },
      { label: 'Includes', value: 'Drumstick' },
    ],
    uniqueDetails: 'Available in different colours upon request.',
  },
  {
    name: 'Bowed Lyre (Jouhikko), Soprano — Mahogany/Pine',
    categoryTitle: 'Jouhikko',
    filePrefix: 'jouhikko-soprano',
    price: 520,
    availability: 'in-stock',
    shortDescription: 'Soprano-sized Jouhikko in mahogany with a 100-year-old pine top.',
    specifications: [
      { label: 'Body', value: 'Mahogany' },
      { label: 'Top', value: '100-year-old pine' },
      { label: 'Pegs & bridge', value: 'Maple' },
      { label: 'Tailpiece', value: 'Wenge' },
      { label: 'Strings', value: 'Nylon' },
      { label: 'Includes', value: 'Horsehair bow' },
    ],
  },
  {
    name: 'Bowed Lyre (Jouhikko), Alto — Mahogany/Spruce',
    categoryTitle: 'Jouhikko',
    filePrefix: 'jouhikko-alto-a',
    price: 590,
    availability: 'in-stock',
    shortDescription: 'Alto Jouhikko in mahogany with a spruce top.',
    specifications: [
      { label: 'Body', value: 'Mahogany' },
      { label: 'Top', value: 'Spruce' },
      { label: 'Pegs & bridge', value: 'Maple' },
      { label: 'Tailpiece', value: 'Wenge' },
      { label: 'Strings', value: 'Nylon' },
      { label: 'Includes', value: 'Horsehair bow' },
    ],
  },
  {
    name: 'ProIgil 5.0 SHB (Walnut, Maple Neck)',
    categoryTitle: 'ProIgil',
    filePrefix: 'proigil-5-0-shb',
    price: 760,
    availability: 'in-stock',
    shortDescription: 'A 5.0 Igil in walnut with a maple neck.',
    specifications: [
      { label: 'Body', value: 'Walnut' },
      { label: 'Neck', value: 'Maple' },
      { label: 'Soundboard', value: 'Goat skin' },
      { label: 'Strings', value: 'Nylon' },
    ],
  },
  {
    name: 'ProIgil 4.0 NHB (Walnut/Aspen, Horsehair Strings)',
    categoryTitle: 'ProIgil',
    filePrefix: 'proigil-4-0-nhb',
    price: 590,
    availability: 'in-stock',
    shortDescription: 'A 4.0 Igil in walnut and aspen, strung with horsehair.',
    specifications: [
      { label: 'Body', value: 'Walnut' },
      { label: 'Neck', value: 'Aspen' },
      { label: 'Soundboard', value: 'Goat skin' },
      { label: 'Strings', value: 'Horsehair' },
    ],
  },
  {
    name: 'Una (Experimental One-String Instrument)',
    categoryTitle: 'Experimental Instrument',
    filePrefix: 'una',
    price: 90,
    availability: 'in-stock',
    shortDescription: 'An experimental one-string instrument built from a wooden coffee can.',
    specifications: [
      { label: 'Body', value: 'Wooden coffee can' },
      { label: 'Stick', value: 'Round stick' },
      { label: 'Soundboard', value: 'Goat skin' },
      { label: 'Extra', value: 'Resonator beads' },
    ],
  },
  {
    name: 'Bowed Lyre (Jouhikko), Alto — Mahogany/Aged Pine',
    categoryTitle: 'Jouhikko',
    filePrefix: 'jouhikko-alto-b',
    price: 620,
    availability: 'in-stock',
    shortDescription: 'Alto Jouhikko in mahogany with an aged pine soundboard and fine tuners.',
    specifications: [
      { label: 'Body', value: 'Mahogany' },
      { label: 'Soundboard', value: 'Aged pine' },
      { label: 'Handles', value: 'Black alder' },
      { label: 'Pegs', value: 'Maple' },
      { label: 'End piece', value: 'Flaming birch' },
      { label: 'Tuners', value: 'Fine tuners' },
      { label: 'Strings', value: 'Nylon' },
    ],
  },
  {
    name: 'ProIgil 5.0 BHB (Walnut/Pine, Horse Carving)',
    categoryTitle: 'ProIgil',
    filePrefix: 'proigil-5-0-bhb',
    price: 790,
    availability: 'in-stock',
    shortDescription: 'A 5.0 Igil in walnut and pine with a hand-carved horse motif.',
    specifications: [
      { label: 'Body', value: 'Walnut' },
      { label: 'Neck', value: 'Pine' },
      { label: 'Soundboard', value: 'Goat skin' },
      { label: 'Strings', value: 'Nylon' },
      { label: 'Decoration', value: 'Hand-carved horse motif' },
    ],
  },
  {
    name: 'Bowed Lyre (Jouhikko), Alto — Flaming Birch/Spruce',
    categoryTitle: 'Jouhikko',
    filePrefix: 'jouhikko-alto-c',
    price: 620,
    availability: 'in-stock',
    shortDescription: 'Alto Jouhikko in flaming birch with a spruce top.',
    specifications: [
      { label: 'Body', value: 'Flaming birch' },
      { label: 'Top', value: 'Spruce' },
      { label: 'Pegs', value: 'Maple' },
      { label: 'Bridge & tailpiece', value: 'Wenge' },
      { label: 'Strings', value: 'Nylon' },
      { label: 'Includes', value: 'Horsehair bow' },
    ],
  },
];

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function findFiles(prefix, kind) {
  // kind: 'photo' or 'video'
  const all = fs.readdirSync(MEDIA_FOLDER);
  const matches = all.filter((f) => f.startsWith(`${prefix}_${kind}`));
  matches.sort(); // photo01, photo02, ... sorts correctly as strings here
  return matches.map((f) => path.join(MEDIA_FOLDER, f));
}

async function uploadImage(filePath) {
  const stream = fs.createReadStream(filePath);
  const asset = await client.assets.upload('image', stream, {
    filename: path.basename(filePath),
  });
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
}

async function uploadVideoFile(filePath) {
  const stream = fs.createReadStream(filePath);
  const asset = await client.assets.upload('file', stream, {
    filename: path.basename(filePath),
  });
  return { _type: 'file', asset: { _type: 'reference', _ref: asset._id } };
}

const categoryIdCache = {};
async function getCategoryId(title) {
  if (categoryIdCache[title]) return categoryIdCache[title];
  const id = await client.fetch(
    `*[_type == "instrumentCategory" && title == $title][0]._id`,
    { title }
  );
  if (!id) {
    throw new Error(
      `Instrument Category "${title}" not found in Sanity. Check it was created and the title matches exactly.`
    );
  }
  categoryIdCache[title] = id;
  return id;
}

// ----------------------------------------------------------------------
// Main import
// ----------------------------------------------------------------------

async function importInstrument(item) {
  console.log(`\n--- ${item.name} ---`);

  const categoryId = await getCategoryId(item.categoryTitle);

  const photoFiles = findFiles(item.filePrefix, 'photo');
  const videoFiles = findFiles(item.filePrefix, 'video');

  if (photoFiles.length === 0) {
    console.warn(`  WARNING: no photo files found for prefix "${item.filePrefix}" — check MEDIA_FOLDER and filenames.`);
  }

  console.log(`  Uploading ${photoFiles.length} photo(s)...`);
  const images = [];
  for (const f of photoFiles) {
    images.push(await uploadImage(f));
    process.stdout.write('.');
  }

  let videos = [];
  if (videoFiles.length > 0) {
    console.log(`\n  Uploading ${videoFiles.length} video(s)...`);
    for (const f of videoFiles) {
      videos.push(await uploadVideoFile(f));
      process.stdout.write('.');
    }
  }

  const doc = {
    _type: 'instrument',
    name: item.name,
    instrumentType: { _type: 'reference', _ref: categoryId },
    slug: { _type: 'slug', current: slugify(item.name) },
    images,
    videos,
    shortDescription: item.shortDescription,
    specifications: item.specifications.map((s) => ({
      _type: 'specItem',
      _key: slugify(s.label) + '-' + Math.random().toString(36).slice(2, 8),
      label: s.label,
      value: s.value,
    })),
    price: item.price,
    availability: item.availability,
  };

  if (item.uniqueDetails) {
    doc.description = [
      {
        _type: 'block',
        _key: 'block1',
        style: 'normal',
        children: [{ _type: 'span', _key: 'span1', text: item.uniqueDetails }],
      },
    ];
  }

  const created = await client.create(doc);
  console.log(`\n  Created: ${created._id}`);
  return created;
}

async function main() {
  if (!process.env.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN.includes('paste-your')) {
    console.error('ERROR: SANITY_API_TOKEN is not set. Copy .env.example to .env and fill in your token.');
    process.exit(1);
  }
  if (!MEDIA_FOLDER || !fs.existsSync(MEDIA_FOLDER)) {
    console.error(`ERROR: MEDIA_FOLDER does not exist: ${MEDIA_FOLDER}`);
    process.exit(1);
  }

  for (const item of instruments) {
    try {
      await importInstrument(item);
    } catch (err) {
      console.error(`  FAILED for "${item.name}":`, err.message);
    }
  }

  console.log('\nDone. Check the Studio to review and spot-check the imported instruments.');
}

main();
