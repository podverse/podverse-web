pipeline {
    agent {
        docker { image 'node:10' }
    }
    stages {
        stage('build') {
            steps {
                sh 'node --version'
                sh 'echo "Hello world!"'
                sh 'ls -a'
                sh 'pwd'
                sh 'ls /'
            }
        }
    }
}
