pipeline {
    agent {
        docker {
            image 'podverse/podverse_qa_web:latest'
            alwaysPull true
        }
    }
    stages {
        stage('build') {
            steps {
                echo "Start tests"
                sh 'WEB_HOST="stage.podverse.fm" npm run test:stage --prefix /tmp'
            }
        }
    }
}
