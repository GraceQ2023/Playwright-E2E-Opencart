pipeline {
    agent any  

    tools {
        nodejs 'mynodejs'  // ask Jenkins to use the NodeJS version the configured in Jenkins global tools
    }

    environment {
        PATH = "$PATH:/opt/homebrew/bin"  // ensure Allure CLI from Homebrew is found
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                git branch: 'main', url: 'https://github.com/GraceQ2023/Playwright-E2E-Opencart.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh '''
                    npm ci
                    npm install -D allure-playwright allure-commandline --save-dev
                    npx playwright install
                '''
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running Playwright tests...'
                sh 'npm run "$script"'  
            }
        }

        stage('Generate Allure Report') {
            steps {
                echo 'Generating Allure report...'
                // more robust and fault-tolerant for report generation when allure-results may be missing
                sh '''
                    if [ -d "allure-results" ]; then
                        /opt/homebrew/Cellar/allure/2.35.1/bin/allure generate allure-results --clean -o allure-report
                    else
                        echo "⚠️ No allure-results directory found — skipping report generation."
                    fi
                '''
            }
        }

    }

    post {
        always {
            // backup for reports per build, can be downloaded from Jenkins UI later if needed
            echo 'Archiving Playwright & Allure reports...'
            archiveArtifacts artifacts: 'playwright-report/**, allure-report/**', allowEmptyArchive: true

            echo 'Publishing Allure report in Jenkins...'
            allure(
                includeProperties: false,
                jdk: '',
                results: [[path: 'allure-results']]
            )

        }

        success {
            echo '✅ Build and tests completed successfully!'
        }

        failure {
            echo '❌ Build or tests failed - check logs and reports for details.'
        }
    }
}


