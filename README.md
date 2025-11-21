# 🧩 Playwright E2E Automation Framework — OpenCart

End-to-end (E2E) testing framework built using **Playwright** with **Typescript**, integrated with **Allure Reporting** and **Jenkins CI Pipeline** for robust and scalable web test automation.

---

## 🚀 Project Overview

This project automates key **OpenCart** workflows, such as **login, registration, product search, checkout, account update, and logout**.
Using the **Page Object Model (POM)** architecture for better maintainability, scalability, and readability.  
It also incorporates **data-driven testing** for enhanced test coverage.

The framework runs seamlessly:
- ✅ Locally on macOS  
- ✅ Via Jenkins (Freestyle & Pipeline)  
- ✅ Integrated with **Allure Reports** 

---

## 🧠 Key Features

- 🎭 **Playwright Framework** 
- 🧱 **Page Object Model (POM)** 
- 📊 **Data-Driven Testing** 
- ♻️ **Reusable Utilities**
- 🧾 **Allure Reports Integration**
- ⚙️ **Parameterized Test Runs** 
- 🧪 **Parallel Execution**
- 🔐 **Environment Variables Handling**
- 🧰 **Jenkins CI/CD Pipeline**

---

## 🗂️ Project Structure
Refer to the project directory for detailed structure.

## 🧱 Tech Stack

- **Playwright** 
- **TypeScript** 
- **Node.js (LTS)** 
- **Allure** 
- **Jenkins**
- **GitHub** 


## Test Pyramid Context

Since the demo application does not provide any public API endpoints, it is not feasible to implement true API Integration tests (middle layer of the Test Pyramid).

As a result, the test suite primarily consists of:
- UI / E2E tests: covering UI and critical user workflows (top layer of Test Pyramid)
- database connectivity test: representing a basic Integration test (middle layer of Test Pyramid)

This structure reflects the limitations of the demo application while still demonstrating a layered testing approach aligned with the Test Pyramid concept.
