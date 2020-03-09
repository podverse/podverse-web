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
                sh '''
                    if cd podverse-qa;
                    then
                        git pull;
                    else
                        git clone https://github.com/podverse/podverse-qa.git;
                    fi
                '''
                sh 'cd podverse-qa & ls & echo "helloo world"'
                echo 'ok...'
                sh 'npm install --prefix podverse-qa/podverse-web'
                sh 'npm run test:stage --prefix podverse-qa/podverse-web'
            }
        }
    }
}
