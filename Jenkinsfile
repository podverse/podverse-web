pipeline {
    agent {
        docker {
            image 'podverse/podverse_qa_web:latest'
            alwaysPull true
        }
    }
    stages {
        stage('build') {
            environment {
                WEB_HOST = "stage.podverse.fm"
            }
            steps {
                sh "npm run test:stage --prefix /tmp"
            }
        }
    }
}
