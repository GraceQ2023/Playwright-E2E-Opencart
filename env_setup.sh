# environment setup script for Playwright testing framework with Allure reporting

# 1. Install core dependencies (Playwright package)
#    - Jenkins reads package.json file in the project directory, and detects the dependencies to install.
npm install

# 2. Install Playwright-to-Allure JSON adapter AND Allure Commandline locally for report generation
npm install -D allure-playwright allure-commandline 

# 3. Download and install the necessary browser binaries for Playwright
npx playwright install