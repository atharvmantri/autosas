import axios from 'axios';

const BUILDWITH_LOCUS_URL = process.env.BUILDWITH_LOCUS_URL || 'https://api.buildwithlocus.com/api';

function getHeaders(apiKey: string): Record<string, string> {
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

export async function deployToRailway(
  repoUrl: string,
  envVars: Record<string, string>
): Promise<{ url: string }> {
  const response = await axios.post(
    `${BUILDWITH_LOCUS_URL}/deploy`,
    { repo_url: repoUrl, environment: 'production', database: true, env_vars: envVars },
    { headers: getHeaders(process.env.LOCUS_API_KEY || '') }
  );
  return { url: response.data.deployed_url };
}

export async function provisionDatabase(): Promise<{ connectionString: string }> {
  const response = await axios.post(
    `${BUILDWITH_LOCUS_URL}/database`,
    {},
    { headers: getHeaders(process.env.LOCUS_API_KEY || '') }
  );
  return { connectionString: response.data.connection_string };
}
