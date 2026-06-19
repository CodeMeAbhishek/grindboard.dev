const body = JSON.stringify({
  query: "query userContestRankingInfo($username: String!) { userContestRanking(username: $username) { rating globalRanking topPercentage badge { name } } }",
  variables: { username: "UXwbjK5c3I" }
});
fetch("https://leetcode.com/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json", "Referer": "https://leetcode.com" },
  body
}).then(r => r.json()).then(d => console.log(JSON.stringify(d)));
