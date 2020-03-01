pipeline {
    agent {
        docker { image 'node:10' }
    }
    stages {
        stage('build') {
            steps {
                sh '${env.BUILD_ID}'
                sh '${env.BUILD_NUMBER}'
                sh '${env.BUILD_TAG}'
                sh '${env.EXECUTOR_NUMBER}'
                sh '${env.JAVA_HOME}'
                sh '${env.JENKINS_URL}'
                sh '${env.JOB_NAME}'
                sh '${env.NODE_NAME}'
                sh '${env.WORKSPACE}'
                sh '${env.BUILD_ID}'
                sh '${env.BUILD_ID}'
                sh '${env.BUILD_ID}'
            }
        }
    }
}
