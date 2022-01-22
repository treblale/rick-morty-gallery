import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const defaultOptions = {
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const client = new ApolloClient({
  uri: "https://rickandmortyapi.com/graphql/",
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export default async (req, res) => {
  const lol = req.body;
  const lol2 = JSON.parse(lol);

  try {
    const { data } = await client.query({
      query: gql`
        query {
          characters(filter: { name: "${lol2.search}", gender: "${lol2.gender}"}) {
            info {
              count
              pages
            }
            results {
              name
              id
              gender
              location {
                id
                name
              }
              origin {
                id
                name
              }
              episode {
                id
                episode
                air_date
              }
              image
            }
          }
        }
      `,
    });
    res.status(200).json({ characters: data.characters.results, error: null });
  } catch (error) {
    if (error.message === "404: Not Found") {
      res.status(400).json({ characters: null, error: "No character found." });
    } else {
      res
        .status(500)
        .json({ characters: null, error: "Internal Error, please try again." });
    }
  }
};
