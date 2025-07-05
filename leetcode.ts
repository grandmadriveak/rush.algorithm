export const leetcodeGraphQL = async (
  query: string,
  operationName: string,
  variables?: object,
) => {
  const url = "https://leetcode.com/graphql";
  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, operationName, variables }),
  });

  if (!response.ok) {
    console.error(response);
    throw new Error(`HTTP error status ${response.status}`);
  }

  return await response.json();
};
