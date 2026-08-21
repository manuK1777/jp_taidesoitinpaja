import 'dotenv/config';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const DRY_RUN = process.argv.includes('--dry-run');

// ----------------------------------------------------------------------
// Migrates the old flat `videos: [{ _type: 'file', asset: {...} }]`
// shape into the new `videos: [{ _type: 'videoItem', video: {...},
// poster: undefined, description: undefined }]` shape.
//
// - Only touches entries that are still the old raw-file shape
//   (skips any already-migrated `videoItem` entries, so this is safe
//   to re-run).
// - Does NOT invent poster or description — those stay empty and must
//   be filled in manually in Studio afterwards (they'll show up as
//   validation errors once the new schema is deployed, which is
//   expected).
// ----------------------------------------------------------------------

function randomKey() {
  return Math.random().toString(36).slice(2, 10);
}

async function migrateDoc(doc) {
  const oldVideos = doc.videos || [];

  const needsMigration = oldVideos.some((v) => v._type === 'file');
  if (!needsMigration) {
    console.log(`  Skipping "${doc.name}" — no old-shape video entries.`);
    return;
  }

  const newVideos = oldVideos.map((v) => {
    if (v._type === 'videoItem') return v; // already migrated, leave as-is
    return {
      _type: 'videoItem',
      _key: randomKey(),
      video: { _type: 'file', asset: v.asset },
      // poster and description intentionally left unset —
      // fill in manually in Studio.
    };
  });

  console.log(`  "${doc.name}": migrating ${oldVideos.length} video(s).`);

  if (DRY_RUN) {
    console.log('    (dry run — no changes written)');
    return;
  }

  await client.patch(doc._id).set({ videos: newVideos }).commit();
  console.log(`    Updated ${doc._id}`);
}

async function main() {
  if (!DRY_RUN && (!process.env.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN.includes('paste-your'))) {
    console.error('ERROR: SANITY_API_TOKEN is not set. Copy .env.example to .env and fill in your token.');
    process.exit(1);
  }

  console.log(DRY_RUN ? 'Running in DRY RUN mode — no writes will happen.\n' : 'Running migration — changes WILL be written.\n');

  const docs = await client.fetch(
    `*[_type == "instrument" && count(videos) > 0]{ _id, name, videos }`
  );

  console.log(`Found ${docs.length} instrument(s) with videos.\n`);

  for (const doc of docs) {
    try {
      await migrateDoc(doc);
    } catch (err) {
      console.error(`  FAILED for "${doc.name}":`, err.message);
    }
  }

  console.log('\nDone.');
  if (!DRY_RUN) {
    console.log('Next: deploy the updated schema, then fill in poster + description for each video entry in Studio.');
  }
}

main();
