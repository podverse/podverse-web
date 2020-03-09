pipeline {
    agent {
        docker {
            image 'podverse/podverse_qa_web'
        }
    }
    stages {
        stage('build') {
            environment {
                WEB_HOST = 'stage.podverse.fm'
            }
            steps {
                echo "Start tests on ${WEB_HOST}"
                sh 'npm run test:stage --prefix podverse-qa/podverse-web'
            }
        }
    }
}
