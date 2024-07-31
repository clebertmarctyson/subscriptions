# To use this template, you need to follow these steps:

1. Open the [`.env`](.env).

2. Update the `DATABASE_URL` property with the correct connection details for your PostgreSQL database. Replace `postgres` with the actual username, `password` with the actual password, `localhost` with the actual host address, `5432` with the actual port number, and `dbname` with the actual name of your database.

3. Obtain the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` by creating a new project in the Google Cloud Console. Follow these steps:

   - Go to the Google Cloud Console (https://console.cloud.google.com/).
   - Create a new project.
   - Configure the Consent Screen by providing the required information such as email, product name, etc.
   - Create an OAuth 2.0 Client ID.
   - Copy the generated client ID and client secret.
   - Update the `GOOGLE_CLIENT_ID` property in the [`.env`](.env) file with the copied client ID.
   - Update the `GOOGLE_CLIENT_SECRET` property in the [`.env`](.env) file with the copied client secret.

4. Generate a secure value for the `NEXTAUTH_SECRET` property. You can use a tool like `openssl` to generate a random string. Replace the existing value with the generated string.

5. If you have set up a redirect URI in the OAuth 2.0 Client ID settings, add it to the [`.env`](.env) file as well.

Make sure to save the changes to the [`.env`](.env) file after making the modifications.
