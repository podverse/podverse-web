pipeline {
    agent {
        docker { image 'podverse/podverse_qa_web' }
    }
    stages {
        stage('build') {
            environment {
                WEB_HOST = 'stage.podverse.fm'
            }
            steps {
                echo "helloooo ${WEB_HOST}"
                sh 'ls .'
                echo "helloooo2"
                sh 'ls /tmp'
                echo "helloooo3"
                sh 'npm run test:stage --prefix podverse-qa/podverse-web'
            }
        }
    }
}
