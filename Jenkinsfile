pipeline {
    agent {
        docker { image 'node:10' }
    }
    stages {
        stage('build') {
            steps {
                git clone "https://github.com/podverse/podverse-qa.git"
                cd podverse-qa
                ls
            }
        }
    }
}
