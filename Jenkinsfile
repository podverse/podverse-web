pipeline {
    agent {
        docker { image 'node:10' }
    }
    stages {
        stage('build') {
            steps {
                sh 'rm -rf podverse-qa'
                sh 'git clone "https://github.com/podverse/podverse-qa.git"'
                sh 'cd podverse-qa/podverse-web | npm install --prefix podverse-qa/podverse-web'
                sh 'ls podverse-qa/podverse-web'
            }
        }
    }
}
