pipeline {
  agent any
  properties([pipelineTriggers([githubPush()])])
  options {
    buildDiscarder(logRotator(numToKeepStr: '100', artifactNumToKeepStr: '100'))
  }
  environment {
    DOCKERHUB_PASSWORD = credentials('dockerhub-password')
    DOCKERHUB_USERNAME = credentials('dockerhub-username')
  }
  stages {
    stage('Docker build image') {
      steps {
        sh """
        echo 'hello worlds'
        docker build -t podverse_web .
        """
      }
    }
    stage('Docker login') {
      steps {
        sh """
        docker login --username $DOCKERHUB_USERNAME --password $DOCKERHUB_PASSWORD
        """
      }
    }
    stage('Docker push images') {
      steps {
        sh """
        docker tag podverse_web podverse/podverse_web:stage
        docker push podverse/podverse_web:stage
        """
      }
    }
  }
}