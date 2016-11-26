
const
    app = require('app.js'),
    {port} = require('config.js');

app.listen(port, () => console.log(`Listening on port ${port}`));
