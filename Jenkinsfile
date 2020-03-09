pipeline {
    agent {
        docker { image 'node:10' }
    }
    stages {
        stage('build') {
            steps {
                sh 'git clone "https://github.com/podverse/podverse-qa.git"'
                sh 'podverse-qa & npm i'
                sh 'ls podverse-qa'
                sh 'ls podverse-qa/node_modules'
                sh 'podverse-qa & npm run test:stage'
            }
        }
    }
}
