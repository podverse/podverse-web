pipeline {
    agent {
        docker { image 'node:10' }
    }
    stages {
        stage('build') {
            environment {
                WEB_HOST = 'stage.podverse.fm'
            }
            steps {
                echo "helloooo ${WEB_HOST}"
                sh '''
                    if cd podverse-qa;
                    then
                        git pull;
                    else
                        git clone https://github.com/podverse/podverse-qa.git;
                    fi
                '''
                sh 'npm install --prefix podverse-qa/podverse-web'
                sh 'npm run test:stage --prefix podverse-qa/podverse-web'
                echo 'asdf1'
                sh 'ls /var/jenkins_home/workspace/podverse-web_master/podverse-qa/podverse-web/node_modules/puppeteer/'
                echo 'asdf2'
                sh 'ls /var/jenkins_home/workspace/podverse-web_master/podverse-qa/podverse-web/node_modules/puppeteer/.local-chromium/'
                echo 'asdf3'
                sh 'ls /var/jenkins_home/workspace/podverse-web_master/podverse-qa/podverse-web/node_modules/puppeteer/.local-chromium/linux-686378'
                echo 'asdf4'
                sh 'ls /var/jenkins_home/workspace/podverse-web_master/podverse-qa/podverse-web/node_modules/puppeteer/.local-chromium/linux-686378/chrome-linux'
                echo 'asdf5'
                sh 'ls /var/jenkins_home/workspace/podverse-web_master/podverse-qa/podverse-web/node_modules/puppeteer/.local-chromium/linux-686378/chrome-linux/chrome'
                echo 'asdf6'
            }
        }
    }
}
