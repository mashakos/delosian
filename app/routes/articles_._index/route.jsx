import { baseMeta } from '~/utils/meta';
import { getPosts } from './posts.server';
import { json } from '@remix-run/cloudflare';
import client from 'tina/__generated__/client.js';

export async function loader() {

  // Tina query, for featured post. Blank reference page. Route is app/routes/featured
  const { data, query, variables } = await client.queries.featured({
    relativePath: "Featured.md",
  });



  const allPosts = await getPosts();
  const featured = allPosts.filter(post => post.frontmatter.title === data.featured.post.title)[0];
  const posts = allPosts.filter(post => featured?.slug !== post.slug);
  featured.frontmatter.featured = true;
  posts.map( post => post.frontmatter.featured = false);
  // console.log(featured.frontmatter);

  return json({ posts, featured });
}

export function meta() {
  return baseMeta({
    title: 'Articles',
    description:
      'A collection of technical design and development articles. May contain incoherent ramblings.',
  });
}

export { Articles as default } from './articles';
