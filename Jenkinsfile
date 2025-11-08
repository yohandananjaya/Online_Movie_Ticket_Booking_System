pipeline {
	agent any

	environment {
		// For docker-in-docker sidecar from compose.jenkins.yml
		DOCKER_HOST = 'tcp://dind:2375'
		DOCKER_TLS_CERTDIR = ''
		CLIENT_IMAGE = 'movieapp-client:latest'
		SERVER_IMAGE = 'movieapp-server:latest'
	}

	options {
		timestamps()
		ansiColor('xterm')
	}

	stages {
		stage('Checkout') {
			steps {
				checkout scm
			}
		}

		stage('Client: Install & Build') {
			steps {
				dir('client') {
					sh 'node -v || true'
					sh 'npm -v || true'
					sh 'npm ci'
					sh 'npm run build'
				}
			}
		}

		stage('Server: Install (no tests)') {
			steps {
				dir('server') {
					sh 'npm ci'
				}
			}
		}

		stage('Docker Build Images') {
			steps {
				sh 'docker version'
				sh 'docker build -t ${CLIENT_IMAGE} -f client/Dockerfile client'
				sh 'docker build -t ${SERVER_IMAGE} -f server/Dockerfile server'
			}
		}
	}

	post {
		success {
			echo 'Build and Docker images created successfully.'
		}
		failure {
			echo 'Build failed. Check logs above.'
		}
	}
}
