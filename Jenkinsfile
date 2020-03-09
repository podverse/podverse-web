pipeline {
    agent {
        docker { image 'node:10' }
    }
    stages {
        stage('build') {
            steps {
                sh 'rm -rf podverse-qa'
                sh 'git clone "https://github.com/podverse/podverse-qa.git"'
                sh 'npm install --prefix podverse-qa/podverse-web'
                echo 'cmon'
                sh 'ls podverse-qa/podverse-web'
            }
        }
    }
}
