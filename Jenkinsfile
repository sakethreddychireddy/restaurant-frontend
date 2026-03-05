pipeline {
    agent any

    environment {
        NODE_VERSION = '20'
        APP_DIR = '/home/saketh/restaurant-frontend'
        BUILD_DIR = '/home/saketh/restaurant-frontend/dist'
        NGINX_DIR = '/var/www/restaurant-frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checking out code...'
                checkout scm
            }
        }

        stage('Install Node') {
            steps {
                echo '⚙️ Checking Node.js...'
                sh '''
                    node --version
                    npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📥 Installing dependencies...'
                sh 'npm ci'
            }
        }

        stage('Type Check') {
            steps {
                echo '🔍 Running TypeScript type check...'
                sh 'npm run type-check'
            }
        }

        stage('Build') {
            steps {
                echo '🔨 Building for production...'
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying to Nginx...'
                sh '''#!/bin/bash
                    # Create nginx directory if not exists
                    sudo mkdir -p /var/www/restaurant-frontend

                    # Remove old build
                    sudo rm -rf /var/www/restaurant-frontend/*

                    # Copy new build
                    sudo cp -r dist/* /var/www/restaurant-frontend/

                    # Set permissions
                    sudo chown -R www-data:www-data /var/www/restaurant-frontend
                    sudo chmod -R 755 /var/www/restaurant-frontend

                    echo "✅ Frontend deployed!"
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline succeeded! Frontend is live.'
        }
        failure {
            echo '❌ Pipeline failed! Check logs above.'
        }
    }
}