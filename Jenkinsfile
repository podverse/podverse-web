pipeline {
    agent {
        docker { image 'node:10' }
    }
    stages {
        stage('build') {
            environment {
                WEB_HOST = 'stage.podverse.fm'
            }
            steps {
                echo "helloooo ${WEB_HOST}"
                sh 'sudo apt-get update -y'
                sh 'sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget'
                sh '''
                    if cd podverse-qa;
                    then
                        git pull;
                    else
                        git clone https://github.com/podverse/podverse-qa.git;
                    fi
                '''
                sh 'npm install --prefix podverse-qa/podverse-web'
                sh 'npm run test:stage --prefix podverse-qa/podverse-web'
            }
        }
    }
}
