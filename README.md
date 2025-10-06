# 🇩🇪 Expat Tax Calculator 2025

An easy-to-use **German income tax calculator** that helps you estimate your **net (take-home) income** for 2025.  
Supports *married splitting*, *social contributions*, and *PDF report export*.  
Designed especially for **expats in Germany** who want a simple and visual way to understand how taxes affect their income.

---

## 💡 What it does

- Calculates **income tax**, **social contributions**, and **net income** from your gross salary.  
- Supports **married couples (splitting mode)** for more accurate household tax simulation.  
- Lets you add optional details such as public health insurance contributions.  
- Generates a **PDF summary report** for your records.  
- Works completely **offline** once installed — your data stays private.

---

## 🧾 Example output

After entering your details, you’ll see a clean summary like:

| Category | Example (You) | Example (Partner) |
|-----------|----------------|-------------------|
| Gross Income | €60,000 | €40,000 |
| Taxable Income | €46,164 | €34,494 |
| Income Tax | €9,498 | — |
| Total Social Contributions | €12,570 | €4,240 |
| **Net Income (Take-Home)** | **€37,932** | **€35,760 (approx.)** |

**Household (Married Splitting)**  
- Combined Taxable Income: €80,658  
- Joint Tax: €15,038  
- **Net Household Income: €68,152**

---

## 🛠️ Installation & Setup (Step-by-Step)

These are beginner-friendly instructions — no programming background needed.

### 1️⃣ Install Node.js
You need **Node.js** (version 14 or newer).  
👉 [Download from nodejs.org](https://nodejs.org/en/download)  
Once installed, check with:
```bash
node --version
npm --version
```

2️⃣ Get the Project

* Open a terminal (or Command Prompt) and run:
```bash
git clone https://github.com/abirami91/expat-tax-calculator-2025.git
cd expat-tax-calculator-2025

```
* If you don’t have Git, you can instead click “Code → Download ZIP” on GitHub and unzip it.

3️⃣ Install the App
```bash
npm install
```
This installs everything the app needs.

4️⃣ Start the App
```bash
npm run dev
```

After a few seconds, you’ll see a message like:
```bash
Local: http://localhost:5173/
```

Click or open that link in your browser — the app will appear!


🧭 How to Use
* Open the app in your browser (http://localhost:5173).

* Enter:

* *our gross income

* Your partner’s income (optional)

* Whether you are married (splitting mode)

* Insurance options

* The calculator instantly shows:

* Your taxable income

* Tax, social contributions, and net take-home pay

* A simple chart comparing net vs gross income

* Click “Export PDF” to download your results as a PDF report.



📄 Understanding the Terms

| Term                     | Meaning                                                               |
| ------------------------ | --------------------------------------------------------------------- |
| **Gross Income**         | Total income before deductions                                        |
| **Taxable Income (zvE)** | The income portion used to calculate taxes                            |
| **Income Tax (ESt)**     | Federal income tax owed                                               |
| **Social Contributions** | Mandatory payments for health, pension, unemployment & care insurance |
| **Net Income**           | The amount you actually receive after all deductions                  |


📂 Project Structure
```bash
expat-tax-calculator-2025/
├── public/                 # Static assets (HTML, icons, etc.)
├── src/                    # Main app code (React + TypeScript)
├── package.json            # Dependencies & scripts
├── vite.config.ts          # Build configuration
├── tailwind.config.js      # Tailwind styling
└── README.md               # This file
```
