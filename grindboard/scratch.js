const handle = "UXwbjK5c3l";
fetch("https://leetcode.com/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json", "Referer": "https://leetcode.com" },
  body: JSON.stringify({
    query: `
      query recentAcSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
          id
          title
        }
      }
    `,
    variables: { username: handle, limit: 20 }
  })
})
.then(r => r.json())
.then(console.log);
