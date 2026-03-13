pipeline {
    agent any

    environment {
        VITE_AUTH_API_URL  = credentials('AUTH_API_URL')
        VITE_MENU_API_URL  = credentials('MENU_API_URL')
        VITE_ORDER_API_URL = credentials('ORDER_API_URL')
        VITE_APP_URL       = credentials('APP_URL')
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out latest code...'
                checkout scm
            }
        }

        stage('Install Node') {
            steps {
                echo 'Verifying Node.js version...'
                sh '''
                    node --version
                    npm --version
                    node -e "const v = process.versions.node.split('.')[0]; if(v < 20) { console.error('Node 20+ required, got ' + v); process.exit(1); }"
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm ci'
            }
        }

        stage('Type Check') {
            steps {
                echo 'Running TypeScript type check...'
                sh 'npm run type-check'
            }
        }

        stage('Build') {
            steps {
                echo 'Building for production...'
                sh '''#!/bin/bash
                    echo "VITE_AUTH_API_URL=${VITE_AUTH_API_URL}"   > .env
                    echo "VITE_MENU_API_URL=${VITE_MENU_API_URL}"   >> .env
                    echo "VITE_ORDER_API_URL=${VITE_ORDER_API_URL}" >> .env
                    echo "VITE_APP_URL=${VITE_APP_URL}"             >> .env
                    cat .env
                    npm run build
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying to Nginx...'
                sh '''#!/bin/bash
                    sudo mkdir -p /var/www/restaurant-frontend
                    sudo rm -rf /var/www/restaurant-frontend/*
                    sudo cp -r dist/* /var/www/restaurant-frontend/
                    sudo chown -R www-data:www-data /var/www/restaurant-frontend
                    sudo chmod -R 755 /var/www/restaurant-frontend
                    echo "Frontend deployed successfully"
                '''
            }
        }

    }

    post {
        success {
            echo 'Deployment successful! Frontend is live.'
        }
        failure {
            echo 'Deployment failed! Check logs above.'
        }
    }
}