pipeline {
    agent any
    environment {
        CI = 'true'
        COMPOSE_PROJECT_NAME = "${JOB_NAME}-${BUILD_ID}"
        REGISTRY = 'nexus.fatboarrestaurant.com:8082'
        image = 'fatboar-client'
    }
    stages {
        stage('Build') {
            steps {
                sh 'docker-compose down -v'
                sh 'docker build -t "${image}:${BUILD_ID}" .'
            }
        }
        stage('Tests') {
            steps {
                sh 'echo "Test # ${BUILD_NUMBER} finished" > results_test.txt'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'results_test.txt', fingerprint: true
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    docker.withRegistry("http://${REGISTRY}", 'key-nexus') {
                        def customImage = docker.build("${image}:${BUILD_ID}", "-f Dockerfile .")
                        customImage.push()
                        customImage.push('latest')
                    }
                }
            }
        }
        stage('Deploy for production') {
            when {
                branch 'master'  
            }
            steps {
                script {
                    docker.withRegistry("http://${REGISTRY}", 'key-nexus') {
                        sh 'docker container stop fatboar_client'
                        sh 'docker container rm fatboar_client'
                        sh 'docker-compose down && docker-compose build --pull && docker-compose up -d'
                        input message: 'Do you want to push this version into production?'
                    }
                }
            }
        }
        stage('Deliver for development') {
            when {
                branch 'develop' 
            }
            steps {
                script {
                    docker.withRegistry("http://${REGISTRY}", 'key-nexus') {
                          sh 'docker pull "${REGISTRY}"/"${image}:latest"'
                          sh 'docker container stop fatboar_client'
                          sh 'docker container rm fatboar_client'
                          sh 'docker-compose up -d'
                          sh 'docker logs fatboar_client'
                    }
                }
            }
        }
    }

    post {
        always {
           deleteDir()
        }
        success {
            echo 'Build Succeed ! 🥳'
        }
        unstable {
            echo 'Build unstable'
        }
        failure {
            echo 'Build failed 🤐'
        }
        changed {
            echo 'Things were different before...'
        }
    }
}