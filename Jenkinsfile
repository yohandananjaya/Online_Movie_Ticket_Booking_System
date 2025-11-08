// Corrected Jenkinsfile

pipeline {
    agent any

    stages {
        stage('Build Docker Images') {
            steps {
                echo '>>> Building the docker images...'
                sh 'docker compose build'
            }
        }

        stage('Run Docker Containers') {
            steps {
                echo '>>> Stopping any old containers and running new ones...'
                // මුලින්ම පරණ container එකක් run වෙනවා නම් නවත්වනවා
                sh 'docker compose down' 
                // අලුත් containers ටික background එකේ run කරනවා
                sh 'docker compose up -d'
            }
        }

        stage('Cleanup') {
            steps {
                echo '>>> Cleaning up old docker images...'
                // අනවශ්‍ය images අයින් කරනවා
                sh 'docker image prune -f'
            }
        }
    }
}