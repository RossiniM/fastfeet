// eslint-disable-next-line import/no-extraneous-dependencies
import app from './app';

// eslint-disable-next-line import/first

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`I 'am listening at port: ${port}`));
