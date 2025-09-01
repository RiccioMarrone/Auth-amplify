import AWS from "aws-sdk";

const cognito = new AWS.CognitoIdentityServiceProvider();

export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const params = {
    UserPoolId: "eu-north-1_bH9fSNk15",
    Limit: 60, // numero massimo di utenti da prendere per chiamata
  };

  try {
    // Chiamata a Cognito per ottenere tutti gli utenti
    const data = await cognito.listUsers(params).promise();

    // Trasforma gli utenti nel formato GraphQL definito
    const users = data.Users.map((u) => ({
      Username: u.Username,
      Attributes: u.Attributes.map((a) => ({
        Name: a.Name,
        Value: a.Value,
      })),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
