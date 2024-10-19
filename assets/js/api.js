const GET_USER_ARTICLES = `
    query GetUserArticles($page: Int!) {
        user(username: "mikesheehy") {
            publication {
                posts(page: $page) {
                    title
                    brief
                    slug
                }
            }
        }
    }
`;