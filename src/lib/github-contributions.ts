export async function fetchGithubContributions(
  username: string,
  accessToken: string
) {
  const query = `
    query ($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { login: username },
    }),
    // Next.js cache — revalidate every 6 hours
    next: { revalidate: 60 * 60 * 6 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch GitHub contributions");
  }

  const json = await res.json();
  return json.data.user.contributionsCollection.contributionCalendar;
}
