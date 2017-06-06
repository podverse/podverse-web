
const
    app = require('./app'),
    {port} = require('./config');

app.listen(port, () => console.log(`Listening on port ${port}`));
