pipeline {
    agent {
        docker {
            image 'podverse/podverse_qa_web'
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
                sh "docker images |grep -v REPOSITORY|awk '{print $1}'|xargs -L1 docker pull "
                sh 'npm run test:stage --prefix podverse-qa/podverse-web'
            }
        }
    }
}
