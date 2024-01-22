pipeline {
    agent any

    environment {
        USER = 'ubuntu'
        REMOTE_HOST = '18.206.159.105'
        DEST_FOLDER = '/home/ubuntu/app'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM',
                          branches: [[name: '*/master']],
                          userRemoteConfigs: [[url: 'https://github.com/volodymyrmedvetskyi/jenkins.git',
                                               credentialsId: 'git-credentials']]])
            }
        }

        stage('Node.js configuration') {
            steps {
                dir('ansible') {
                    sshagent(credentials: ['server-credentials']) {
                        sh 'ansible-playbook -i inventory.ini playbook.yml'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: 'build/'
                }
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sshagent(credentials: ['server-credentials']) {
                        script {
                            sh "ssh -o StrictHostKeyChecking=no ${USER}@${REMOTE_HOST} 'mkdir -p ${DEST_FOLDER}'"
                            sh "scp -o StrictHostKeyChecking=no -r build/ package.json ${USER}@${REMOTE_HOST}:${DEST_FOLDER}"
                            sh "ssh -o StrictHostKeyChecking=no ${USER}@${REMOTE_HOST} 'cd ${DEST_FOLDER} && npm install && sudo npm install forever -g && forever start build/index.js'"
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            mail(
                to: 'volodymyrmedvetskyi@gmail.com',
                subject: "${env.JOB_NAME} #${env.BUILD_NUMBER} pipeline result.",
                body: "The build was completed successfully.\n\nBuild URL: ${env.BUILD_URL}"
            )
        }
        failure {
            mail(
                to: 'volodymyrmedvetskyi@gmail.com',
                subject: "${env.JOB_NAME} #${env.BUILD_NUMBER} pipeline result.",
                body: "The build was failured.\n\nBuild URL: ${env.BUILD_URL}"
            )
        }
    }
}
