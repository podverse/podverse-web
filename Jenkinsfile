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
                WEB_HOST = 'stage.podverse.fm'
            }
            steps {
                echo "Start tests on ${WEB_HOST}"
                sh 'ls'
                sh 'ls /'
                sh 'ls /tmp'
                echo "wtffff"
                sh 'cd /tmp | npm run test:stage'
            }
        }
    }
}
