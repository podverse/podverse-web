
const
    app = require('./app'),
    {port, host} = require('./config');

app.listen(port, host, () => console.log(`Listening on port ${port}`));
