const handle = "UXwbjK5c3l";
fetch("https://leetcode.com/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json", "Referer": "https://leetcode.com" },
  body: JSON.stringify({
    query: `
      query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `,
    variables: { username: handle }
  })
})
.then(r => r.json())
.then(data => console.log(JSON.stringify(data, null, 2)));
