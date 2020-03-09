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
                sh 'rm -rf podverse-qa'
                sh 'ls /usr/bin'
                sh 'git clone "https://github.com/podverse/podverse-qa.git"'
                sh 'npm install --prefix podverse-qa/podverse-web'
                sh 'npm run test:stage --prefix podverse-qa/podverse-web'
            }
        }
    }
}
