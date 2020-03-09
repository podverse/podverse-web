pipeline {
    agent {
        docker { image 'node:10' }
    }
    stages {
        stage('build') {
            steps {
                sh 'git clone "https://github.com/podverse/podverse-qa.git"'
                sh 'cd podverse-qa'
                sh 'ls'
            }
        }
    }
}
