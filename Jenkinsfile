pipeline {
    agent {
        docker { image 'node:10' }
    }
    stages {
        stage('build') {
            steps {
                echo "BUILD_ID: ${env.BUILD_ID}"
                echo "BUILD_NUMBER: ${env.BUILD_NUMBER}"
                echo "BUILD_TAG: ${env.BUILD_TAG}"
                echo "EXECUTOR_NUMBER: ${env.EXECUTOR_NUMBER}"
                echo "JAVA_HOME: ${env.JAVA_HOME}"
                echo "JENKINS_URL: ${env.JENKINS_URL}"
                echo "JOB_NAME: ${env.JOB_NAME}"
                echo "NODE_NAME: ${env.NODE_NAME}"
                echo "WORKSPACE: ${env.WORKSPACE}"
            }
        }
    }
}
