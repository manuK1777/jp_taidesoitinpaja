import 'dotenv/config';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const docs = await client.fetch(
  `*[_type == "homePage"]{_id, "prevCount": count(previousWorks), "wipCount": count(workInProgress)}`
);

console.log(JSON.stringify(docs, null, 2));
