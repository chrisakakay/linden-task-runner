const taskRunner = require('../index');
const simpleConf = {
        cwd: '',
        dir: '',
        timestamp: '',
        cases: [
            {
                name: 'chrisakakay',
                url: 'http://jquery.com',
                viewport: { 'width': 480, height: 640 }
            }
        ]
    };

taskRunner.init(simpleConf);
