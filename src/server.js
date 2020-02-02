// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from 'dotenv';

const env = dotenv.config();
// eslint-disable-next-line import/first
import app from './app';

const port = process.env.PORT || 5000;
if (env.error) throw env.error;
app.listen(port, () => console.log(`I 'am listening at port: ${port}`));
